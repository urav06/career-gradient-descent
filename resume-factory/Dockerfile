FROM python:3.12-slim

# Install LaTeX packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir jinja2 pyyaml

WORKDIR /workspace
COPY generate.py /workspace/

ENTRYPOINT ["python", "generate.py"]
