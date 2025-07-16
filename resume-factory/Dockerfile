FROM python:3.12-slim

# Install LaTeX packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy requirements.txt and install dependencies
COPY requirements.txt /workspace/requirements.txt
RUN pip install --no-cache-dir -r /workspace/requirements.txt

# Copy the resume factory package
COPY resume_factory/ /workspace/resume_factory/

ENTRYPOINT ["python", "-m", "resume_factory"]
