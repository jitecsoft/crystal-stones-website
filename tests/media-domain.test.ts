import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { canManageOwnMedia, canReviewMedia, MAX_MEDIA_BYTES, validateMediaUpload } from "../lib/media/domain";
import { createResponsiveWebpVariants } from "../lib/media/image-processing";

test("media upload validation allows only supported non-empty files up to 15 MB", () => {
  assert.equal(validateMediaUpload({ type: "image/jpeg", size: 1024 }), null);
  assert.match(validateMediaUpload({ type: "application/pdf", size: 1024 }) || "", /JPEG, PNG/);
  assert.match(validateMediaUpload({ type: "image/png", size: 0 }) || "", /empty/);
  assert.match(validateMediaUpload({ type: "image/webp", size: MAX_MEDIA_BYTES + 1 }) || "", /15 MB/);
});

test("only content editors and administrators can review media", () => {
  assert.equal(canReviewMedia("uploader"), false);
  assert.equal(canReviewMedia("content_editor"), true);
  assert.equal(canReviewMedia("administrator"), true);
});

test("uploader retry access is limited to assets they created or were assigned", () => {
  const asset = { created_by: "user-a", assigned_to: "user-b" };
  assert.equal(canManageOwnMedia("uploader", "user-a", asset), true);
  assert.equal(canManageOwnMedia("uploader", "user-b", asset), true);
  assert.equal(canManageOwnMedia("uploader", "user-c", asset), false);
  assert.equal(canManageOwnMedia("content_editor", "user-c", asset), true);
});

test("responsive derivatives are WebP, strip metadata and never upscale", async () => {
  const source = await sharp({ create: { width: 80, height: 60, channels: 3, background: "#b9a68d" } })
    .withMetadata({ exif: { IFD0: { Artist: "must not remain" } } }).jpeg().toBuffer();
  const variants = await createResponsiveWebpVariants(source);
  assert.deepEqual(variants.map((variant) => variant.variant), ["thumbnail", "card", "detail"]);
  for (const variant of variants) {
    const metadata = await sharp(variant.data).metadata();
    assert.equal(metadata.format, "webp");
    assert.ok((metadata.width || 0) <= 80);
    assert.ok((metadata.height || 0) <= 60);
    assert.equal(metadata.exif, undefined);
    assert.ok(variant.size > 0);
  }
});
