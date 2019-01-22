% TODO: MIT LICENSE
% Feel free to use this resume as a template.

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{dresume}[General Resume class]

\LoadClass{article}

%A Few Useful Packages
% Not sure.
\usepackage{marvosym}
\usepackage[sfdefault]{roboto}

% color: Allows for hyperlink
% graphicx: Allows for
\RequirePackage{color,graphicx}

% Not sure
\usepackage[usenames,dvipsnames]{xcolor}
% Not sure
\usepackage{fancyhdr}
\usepackage{longtable}

\renewcommand{\headrulewidth}{0pt}
%Setup hyperref package, and colours for links
\usepackage{tabu}
\usepackage{supertabular}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{fancyhdr}
\usepackage{environ}

\usepackage[letterpaper, left=1.25in, right=1.25in, top=0.5in]{geometry}
\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\hypersetup{colorlinks,breaklinks,urlcolor=linkcolour, linkcolor=linkcolour}

\newcolumntype{L}[1]{>{\raggedright\let\newline\\\arraybackslash\hspace{0pt}}p{#1}}
\newcolumntype{C}[1]{>{\centering\let\newline\\\arraybackslash\hspace{0pt}}p{#1}}
\newcolumntype{R}[1]{>{\raggedleft\let\newline\\\arraybackslash\hspace{0pt}}p{#1}}

\newcommand{\newCommandName}{}

\newcommand{\dheader}{%
  \longtable{L{2.5in} R{2.5in}}
  \hspace{0.15in}{\fontfamily{ptm}\selectfont \huge{Dylan Madisetti}}\\
  \hspace{0.15in}{\fontfamily{ptm}\selectfont \textbf{PhD Student, Johns Hopkins, 2022}} &\\
    \hspace{0.15in}Funding: NSF GRFP &
    madisetti@jhu.edu\\
    \hspace{0.15in}Department: Mechanical Engineering &
    github.com/dmadisetti\\
    \hspace{0.15in}Undergrad: Univ. of South Carolina &
    (843) 557-8620\\
    \multicolumn{2}{l}{\hspace{0.15in}B.S. Mechanical Engineering (Math, Computer Science Minors)}\\
  \endlongtable
  \vspace{0.3cm}
}

\NewEnviron{sblock}[1]{%
  \vspace{-0.6cm}
  \longtable{L{0.5in} p{4.5in}}
    & \hspace{-0.5in}\textbf{#1}\\
    \vspace{-0.6cm}
    \BODY
  \endlongtable
}

\newenvironment{experience}[4]{%
  \hspace{-0.5in}\emph{#1} & \hspace{-0.5in}#3
  \\ \hspace{-0.5in}#2 & \hspace{-0.5in}#4
  \\ \hspace{-0.5in} & \hspace{-0.5in}\vspace{-0.4cm}
  \begin{footnotesize}
    \begin{itemize}[leftmargin=-0.5in]
  }{%
    \end{itemize}
  \end{footnotesize}\\
}

%% Example
% \begin{sblock}{Work Experience}
%  \experience%
%    {8/2018.}{current}%
%    {Graduate Research Assistant}%
%    {Johns Hopkins, Baltimore}
%
%    \item Bringing Material Science into the big data domain.
%
%  \endexperience
% \end{sblock}


\newcommand{\pub}[3]{%
  \hspace{-0.5in}\textsc{#1} & \hspace{-0.5in}{\parbox{5in}{\footnotesize{\textbf{#2}:
#3}}}
}

%% Example
% \begin{sblock}{Publications}
%   \pub\\
%     {Sept. 2016}\\
%     {Journal of Intelligent Materials Systems and Structures}\\
%     {A process to Scavenge energy at low acoustic frequencies (<KHz) with
%     controlled geometric configurations (Ahmed, Madisetti, Banerjee)}
% \end{sblock}


\NewEnviron{hblock}[1]{%
  \longtable{L{0.5in} L{2.5in} R{0.5in} L{2.5in}}
      & \hspace{-0.15in}\textbf{#1}\vspace{-0.6cm}\\
      \BODY
  \endlongtable
}

\newcommand{\h}[4]{%
  \hspace{0in}#1 & \hspace{-0.15in}#2 & #3 & #4 \\
}
