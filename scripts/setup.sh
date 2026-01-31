#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ObjectUI Development Environment Setup${NC}"
echo -e "${BLUE}==========================================${NC}\n"

# Check Node.js
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js 20+ from https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version must be 20 or higher (current: $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check/Install pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}📦 Installing pnpm...${NC}"
    npm install -g pnpm
fi

PNPM_VERSION=$(pnpm -v | cut -d'.' -f1)
if [ "$PNPM_VERSION" -lt 9 ]; then
    echo -e "${YELLOW}📦 Upgrading pnpm to v9+...${NC}"
    npm install -g pnpm@latest
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v) detected${NC}"

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
pnpm install

# Build core packages
echo -e "\n${YELLOW}🔨 Building core packages...${NC}"
echo -e "${BLUE}This may take a few minutes on first run...${NC}"

pnpm --filter @object-ui/types build
echo -e "${GREEN}✓ @object-ui/types built${NC}"

pnpm --filter @object-ui/core build
echo -e "${GREEN}✓ @object-ui/core built${NC}"

pnpm --filter @object-ui/react build
echo -e "${GREEN}✓ @object-ui/react built${NC}"

pnpm --filter @object-ui/components build
echo -e "${GREEN}✓ @object-ui/components built${NC}"

pnpm --filter @object-ui/fields build
echo -e "${GREEN}✓ @object-ui/fields built${NC}"

pnpm --filter @object-ui/layout build
echo -e "${GREEN}✓ @object-ui/layout built${NC}"

# Run tests
echo -e "\n${YELLOW}🧪 Running tests...${NC}"
if pnpm test:root; then
    echo -e "${GREEN}✓ All tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Some tests failed, but setup is complete${NC}"
fi

# Success message
echo -e "\n${GREEN}✅ Setup complete!${NC}\n"
echo -e "${BLUE}Available commands:${NC}"
echo -e "  ${GREEN}pnpm dev${NC}              - Start development server"
echo -e "  ${GREEN}pnpm build${NC}            - Build all packages (with Turbo)"
echo -e "  ${GREEN}pnpm test${NC}             - Run all tests"
echo -e "  ${GREEN}pnpm lint${NC}             - Lint all packages"
echo -e "  ${GREEN}pnpm storybook${NC}        - Start Storybook"
echo -e "  ${GREEN}pnpm create-plugin${NC}    - Create a new plugin\n"

echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Read ${GREEN}README.md${NC} for project overview"
echo -e "  2. Read ${GREEN}CONTRIBUTING.md${NC} for contribution guidelines"
echo -e "  3. Read ${GREEN}ARCHITECTURE_EVALUATION.md${NC} for architecture insights"
echo -e "  4. Run ${GREEN}pnpm dev${NC} to start coding!\n"

echo -e "${BLUE}Happy coding! 🎉${NC}\n"
