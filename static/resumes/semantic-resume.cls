\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{semantic-resume}[2026/11/01 Semantic, ATS-friendly resume class]

\LoadClass[10pt,letterpaper]{article}

\RequirePackage[T1]{fontenc}
\RequirePackage{lmodern}
\RequirePackage{microtype}
\RequirePackage[letterpaper,margin=0.68in,top=0.58in,bottom=0.58in]{geometry}
\RequirePackage{enumitem}
\RequirePackage{xcolor}
\RequirePackage{hyperref}
\RequirePackage{titlesec}

% Make copied/extracted text use Unicode rather than font-specific glyph names.
\input{glyphtounicode}
\pdfgentounicode=1

\definecolor{resumeaccent}{HTML}{17365D}
\hypersetup{
  colorlinks=true,
  urlcolor=resumeaccent,
  linkcolor=resumeaccent,
  pdfborder={0 0 0}
}
\urlstyle{same}

\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\setlist[itemize]{leftmargin=1.25em,itemsep=0.12em,topsep=0.2em,parsep=0pt,partopsep=0pt}

\titleformat{\section}
  {\large\bfseries\color{resumeaccent}}
  {}{0pt}{}[\vspace{0.12em}\titlerule]
\titlespacing*{\section}{0pt}{0.7em}{0.32em}

% All identity and contact information is supplied by the document. The class
% intentionally contains no personal data or employer-specific content.
\newcommand{\resumeheader}[4]{%
  {\LARGE\bfseries #1}\par
  \vspace{0.12em}
  {\normalsize #2}\par
  \vspace{0.16em}
  {\small #3}\par
  {\small #4}\par
  \vspace{0.25em}
  {\color{resumeaccent}\hrule height 0.8pt}
}

% Arguments: organization/project, date, role/context.
\newcommand{\resumeentry}[3]{%
  \vspace{0.28em}%
  \textbf{#1}\hfill {\small #2}\par
  \if\relax\detokenize{#3}\relax\else\emph{#3}\par\fi
}

\newenvironment{resumeitems}
  {\begin{itemize}\small}
  {\end{itemize}}

\newcommand{\resumeline}[2]{%
  \textbf{#1}\hspace{0.5em}#2\par
}
