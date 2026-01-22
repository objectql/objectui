#!/bin/bash
# Script to fix broken documentation links

set -e

DOCS_DIR="/home/runner/work/objectui/objectui/docs"

echo "Fixing broken documentation links..."

# Fix /docs/ prefix (fumadocs baseUrl is already /docs, so links should not include it)
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/plugins/|](/plugins/|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/guide/|](/guide/|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/concepts/|](/concepts/|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/components/|](/components/|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/reference/|](/reference/|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/architecture/|](/architecture/|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/ecosystem/|](/ecosystem/|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/docs/community/|](/community/|g' {} +

# Fix /spec/ paths (should be /architecture/)
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/spec/component-package\.md)|](/architecture/component-package)|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/spec/component\.md)|](/architecture/component)|g' {} +

# Fix /api/ paths (should be /reference/api/)
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/api/core)|](/reference/api/core)|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/api/react)|](/reference/api/react)|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/api/components)|](/reference/api/components)|g' {} +

# Fix /protocol/ paths (should be /reference/protocol/)
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/protocol/overview)|](/reference/protocol/overview)|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/protocol/form)|](/reference/protocol/form)|g' {} +
find "$DOCS_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i 's|](/protocol/page)|](/reference/protocol/page)|g' {} +

echo "Links fixed successfully!"
