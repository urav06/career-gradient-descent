#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

IMAGE_NAME="resume-factory:latest"
VOLUME_MOUNTS=(
    "-v" "$SCRIPT_DIR/content:/workspace/content:ro"
    "-v" "$SCRIPT_DIR/blueprints:/workspace/blueprints:ro"
    "-v" "$SCRIPT_DIR/output:/workspace/output"
)

# Show available operations
usage() {
    cat << 'EOF'
Resume Factory 🏭 - Generate professional resumes from YAML or compile TEX files

Usage:
    ./resume.sh <yaml-file>                     # Generate with default template
    ./resume.sh <yaml-file> -b <template>       # Choose template
    ./resume.sh <yaml-file> -o <suffix>         # Add suffix to filename
    ./resume.sh <tex-file>                      # Recompile TEX to PDF
    ./resume.sh --list                          # List available templates
    ./resume.sh --rebuild                       # Rebuild container

Examples:
    ./resume.sh example.yaml                    # → john_developer_resume.pdf
    ./resume.sh example.yaml -b jakegut         # Use modern template
    ./resume.sh example.yaml -o google-job      # → john_developer_resume_google_job.pdf
    ./resume.sh john_developer_resume.tex       # Recompile edited TEX

Available specs:
EOF
    [[ -d content ]] && find content -name "*.y*ml" 2>/dev/null | sed 's|content/||; s/^/    📄 /' | sort || echo "    📄 No specs found"
    echo
}

# Parse arguments
FORCE_REBUILD=false
ARGS=()

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            usage
            exit 0
            ;;
        --list|-l)
            echo "🛠️  Available templates:"
            docker run --rm "${VOLUME_MOUNTS[@]}" "$IMAGE_NAME" --list 2>/dev/null || \
                echo -e "    • sb2nov (classic design)\n    • jakegut (modern layout)"
            exit 0
            ;;
        --rebuild)
            FORCE_REBUILD=true
            shift
            ;;
        -b|--blueprint|-o|--output|--debug)
            ARGS+=("$1")
            [[ "$1" != "--debug" ]] && ARGS+=("$2") && shift
            shift
            ;;
        -*)
            echo "⚠️  Unknown option: $1"
            usage
            exit 1
            ;;
        *)
            if [[ -z "${INPUT_FILE:-}" ]]; then
                INPUT_FILE="$1"
            else
                echo "⚠️  Single input file per run"
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate input file
if [[ -z "${INPUT_FILE:-}" ]]; then
    echo "📄 Input file required"
    usage
    exit 1
fi

# Handle different file types
if [[ "$INPUT_FILE" == *.tex ]]; then
    # TEX file workflow - check in output directory
    if [[ ! -f "output/$INPUT_FILE" ]]; then
        echo "📄 TEX file not found: output/$INPUT_FILE"
        echo "Available TEX files:"
        [[ -d output ]] && find output -name "*.tex" 2>/dev/null | sed 's|output/||; s/^/    📄 /' | sort || echo "    📄 No TEX files found"
        exit 1
    fi
    INPUT_PATH="/workspace/output/$INPUT_FILE"
else
    # YAML file workflow - check in content directory
    if [[ ! -f "content/$INPUT_FILE" ]]; then
        echo "📄 YAML file not found: content/$INPUT_FILE"
        echo "Available specs:"
        [[ -d content ]] && find content -name "*.y*ml" 2>/dev/null | sed 's|content/||; s/^/    📄 /' | sort || echo "    📄 No specs available"
        exit 1
    fi
    INPUT_PATH="/workspace/content/$INPUT_FILE"
fi

# Build container if needed
if [[ "$FORCE_REBUILD" == true ]] || ! docker image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
    echo "🔧 Building Docker container..."
    if docker build -t "$IMAGE_NAME" .; then
        echo "✅ Container ready"
    else
        echo "🚨 Docker build failed"
        exit 1
    fi
fi

# Generate resume
echo "🏭 Generating resume from: $INPUT_FILE"
if docker run --rm "${VOLUME_MOUNTS[@]}" "$IMAGE_NAME" "$INPUT_PATH" "${ARGS[@]}"; then
    echo -e "✅ Generation complete\n📦 Output: $SCRIPT_DIR/output/"
else
    echo "❌ Generation failed"
    exit 1
fi
