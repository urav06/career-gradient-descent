# Resume Factory 🏭

Generate professional resumes from YAML content using LaTeX templates.

## Quick Start

1. **Add your content** in `content/example.yaml`
2. **Generate resume:**
   ```bash
   ./resume.sh example.yaml
   ```
3. **Find your files** in `output/john_developer_resume.pdf` and `output/john_developer_resume.tex`

## Directory Structure

```
resume-factory/
├── content/          # Your YAML content files
│   └── example.yaml  # Sample resume content
├── output/           # Generated PDFs and TEX files
├── blueprints/       # LaTeX templates (sb2nov, jakegut)
└── resume.sh         # Main script
```

## Basic Commands

```bash
# Generate with default template
./resume.sh example.yaml

# Choose different template
./resume.sh example.yaml -b jakegut

# Add suffix to filename
./resume.sh example.yaml -o google-job

# Recompile edited TEX file
./resume.sh john_developer_resume_google_job.tex

# List available templates
./resume.sh --list
```

## File Naming

- Output files use your name from the YAML: `firstname_lastname_resume.pdf`
- Custom suffix: `firstname_lastname_resume_suffix.pdf`
- If file exists, adds random suffix automatically

## Content Format

Your YAML file should include:

```yaml
basics:
  name: "Your Name"
  email: "email@example.com"
  phone: "+1 234 567 8900"
  linkedin: "linkedin.com/in/yourname"
  github: "github.com/yourname"
  website: "yourwebsite.com"        # optional

summary: "Brief professional summary"  # optional

education:
  - institution: "University Name"
    location: "City, Country"
    degree: "Degree Name"
    dates: "Start - End"

experience:
  - company: "Company Name"
    location: "City, Country"
    title: "Job Title"
    dates: "Start - End"
    bullets:
      - "Achievement or responsibility"
      - title: "Project Name"
        description: "What you accomplished"

projects:                           # optional
  - name: "Project Name"
    description: "Brief description"
    link: "github.com/project"      # optional

skills:                             # optional
  Languages: "Python, JavaScript, Java"
  Frontend: "React, Vue.js, HTML/CSS"
```

## Manual Editing

Generated TEX files are preserved for fine-tuning. Edit the TEX file directly and recompile:

```bash
# Generate initial files
./resume.sh example.yaml -o final

# Edit the TEX file
edit output/john_developer_resume_final.tex

# Recompile
./resume.sh john_developer_resume_final.tex
```
