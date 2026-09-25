#!/usr/bin/env bash
# Seeds the local GoCommerce store with a small demo catalog.
# Port of gocommerce/scripts/seed.ps1. Safe to re-run: existing slugs are skipped.
set -euo pipefail

BASE="${GC_BASE:-http://127.0.0.1:8080}"
TOKEN="${GC_TOKEN:-dev-token}"

create() {
  local slug="$1" body="$2"
  if curl -sf "$BASE/api/products/slug/$slug" >/dev/null; then
    echo "  skip  $slug (already exists)"; return
  fi
  local code
  code=$(curl -s -o "${TMPDIR:-/tmp}/gc-seed-resp.json" -w '%{http_code}' -X POST "$BASE/api/admin/products" \
    -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "$body")
  case "$code" in
    2*) echo "  new   $slug" ;;
    409) echo "  skip  $slug (already exists)" ;;
    *) echo "  FAIL  $slug ($code): $(cat "${TMPDIR:-/tmp}/gc-seed-resp.json")" >&2; exit 1 ;;
  esac
}

echo "Seeding $BASE"

create cotton-tee '{"slug":"cotton-tee","title":"Cotton tee","status":"active",
 "description":"A plain cotton t-shirt. The variant is what you actually buy.",
 "options":[{"name":"Size","values":["S","M","L"]},{"name":"Colour","values":["Black","White"]}],
 "variants":[
  {"sku":"TEE-S-BLK","price_minor":2500,"options":["S","Black"],"stock_on_hand":12,"weight_grams":180},
  {"sku":"TEE-M-BLK","price_minor":2500,"options":["M","Black"],"stock_on_hand":8,"weight_grams":190},
  {"sku":"TEE-L-BLK","price_minor":2500,"options":["L","Black"],"stock_on_hand":3,"weight_grams":200},
  {"sku":"TEE-M-WHT","price_minor":2500,"options":["M","White"],"stock_on_hand":5,"weight_grams":190},
  {"sku":"TEE-L-WHT","price_minor":2500,"options":["L","White"],"stock_on_hand":0,"weight_grams":200}]}'

create enamel-mug '{"slug":"enamel-mug","title":"Enamel mug","status":"active",
 "description":"One size, so it has a single default variant and no options.",
 "sku":"MUG-001","price_minor":1400,"stock":40}'

create gift-card '{"slug":"gift-card","title":"Gift card","status":"active",
 "description":"Never runs out: track_inventory is false.",
 "options":[{"name":"Value","values":["25","50"]}],
 "variants":[
  {"sku":"GIFT-25","price_minor":2500,"options":["25"],"track_inventory":false},
  {"sku":"GIFT-50","price_minor":5000,"options":["50"],"track_inventory":false}]}'

create winter-scarf '{"slug":"winter-scarf","title":"Winter scarf","status":"draft",
 "description":"A draft: visible to admin, invisible to shoppers.",
 "sku":"SCARF-001","price_minor":3200,"stock":6}'

echo "Done. Catalog: $BASE/api/products"
