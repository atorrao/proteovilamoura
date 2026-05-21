export const ADMIN_PASS = 'admin123'

export const PROGRAMME = {
  wed: {
    label: 'Wed', date: '20 May', full: '20 May 2026 — Wednesday',
    morning: [
      { time: '9:30–12:00', kind: 'special', title: 'Pre-congress course (Optional): Practical Introduction to Python Programming — Diego Mena Santos · Samuel Lozano Juárez', talks: [] },
      { time: '11:00–13:00', kind: 'break', title: 'Registration', talks: [] },
      { time: '13:00–13:15', kind: 'special', title: 'Welcoming Session', talks: [] },
      { time: '13:15–13:45', kind: 'invited', title: 'Invited Speaker — Nelson Soares — Proteomics profiling of Red Blood Cells (RBCs) combined with Deep Machine Learning analysis – reveals potential Diagnostic Biomarkers for Acute Venous Thromboembolism', talks: [] },
    ],
    afternoon: [
      { time: '13:45–15:00', kind: 'section', title: 'Section 1 — Proteomics in the Clinic: From Biomarkers to Precision Medicine #1', chairs: 'José Alexandre Ferreira, Hugo Osório', sectionKey: 'sec1', talks: [
        { time: '13:45–14:00', title: 'Deep plasma EV proteomics by Data-Independent Acquisition reveals circulating signatures of cardiac tissue injury in a preclinical Atrial Fibrillation model', author: 'Estefanía Núñez', type: 'oral', id: 101 },
        { time: '14:00–14:15', title: 'Expanding the knowledge on diagnostic autoantibodies in colorectal cancer through proteomics and immunosensing platforms', author: 'Javier Velázquez Gutiérrez', type: 'oral', id: 102 },
        { time: '14:15–14:30', title: 'Advanced applications for Orbitrap Astral Series MS', author: 'Bernard Delanghe', type: 'sponsor', id: 103 },
        { time: '14:30–14:45', title: 'Mapping the circulating extracellular vesicle proteome in Marfan syndrome patients using minimal plasma volume', author: 'Diego Mena Santos', type: 'oral', id: 104 },
        { time: '14:45–15:00', title: 'Methylthioadenosine: harnessing a natural metabolite to counteract cholestasis progression', author: 'Irene Blázquez García', type: 'oral', id: 105 },
      ]},
      { time: '15:00–15:45', kind: 'break', title: 'Coffee Break + Poster Session 1', talks: [] },
      { time: '15:45–16:15', kind: 'invited', title: 'Invited Speaker — Cherine Bechara — Structural Proteomics Reveals Chemokine Receptor Interactions and Dynamics', talks: [] },
      { time: '16:15–17:15', kind: 'section', title: 'Section 2 — Next-Gen Proteomics: Single-Cell, Proteogenomics & Disruptive Technologies', chairs: 'Ana Varela Coelho, Felix Elortza', sectionKey: 'sec2', talks: [
        { time: '16:15–16:30', title: 'Integrative single-cell proteomics identifies pro-regenerative fingerprints in a sub-population of adult cardiomyocytes', author: 'Consuelo Marin-Vicente', type: 'oral', id: 106 },
        { time: '16:30–16:45', title: 'Preomics: Advancing Plasma Proteomics Through a Next-Generation Enrichment Workflow for Deeper and More Quantitative Biomarker Discovery', author: 'Ann-Christine König', type: 'sponsor', id: 107 },
        { time: '16:45–17:00', title: 'Benchmarking single-cell FACS-assisted strategies: effects on cellular component bias and post-translational modification detection', author: 'Samuel Lozano Juárez', type: 'oral', id: 108 },
        { time: '17:00–17:15', title: 'Quilaban: Illumina Protein Prep: high-plex NGS-based proteomics designed to integrate with the Illumina Multiomics ecosystem', author: 'Álvaro Sánchez-Bernabéu', type: 'sponsor', id: 109 },
      ]},
      { time: '17:15–17:51', kind: 'flash', title: 'Flash Presentations', sectionKey: 'sec1', talks: [
        { time: '17:15–17:19', title: "In depth-analysis of Alzheimer's disease brain tissue reveals novel Aβ interactors", author: 'Ana Montero Calle', type: 'flash', id: 110, sectionKey: 'sec1' },
        { time: '17:19–17:23', title: 'Proteomic and functional characterization of SLC8A1 in colorectal cancer development and metastasis', author: 'Sara Batuecas Domínguez', type: 'flash', id: 111, sectionKey: 'sec1' },
        { time: '17:23–17:27', title: 'DIV Matters: Understanding Proteomic Shifts in Neuronal Maturation for Better Ischemic Modeling', author: 'Eva Maria Ferro Abril Monteiro', type: 'flash', id: 118, sectionKey: 'sec1' },
        { time: '17:27–17:31', title: 'In-depth serum glycoproteomics reveals stage-dependent a2,6-sialylation and systemic prothrombotic signalling in gastric cancer', author: 'Lisandra Gabriela Fernandes Cruz', type: 'flash', id: 311, sectionKey: 'sec3' },
        { time: '17:31–17:35', title: 'Comprehensive nucleolar proteome profiling reveals metastasis-associated remodeling in colorectal cancer', author: 'Elisa Carral Ibarra', type: 'flash', id: 310, sectionKey: 'sec3' },
        { time: '17:35–17:39', title: 'When One is Enough: A Minimalistic "On-Pot" Proteomic Workflow for Global Profiling of Single Caenorhabditis elegans', author: 'Ibon Iloro Manzano', type: 'flash', id: 115, sectionKey: 'sec2' },
        { time: '17:39–17:43', title: 'MALDI-MSI as a Platform for Spatial Multi-Omics in Glioblastoma Research', author: 'Cristina María López Vázquez', type: 'flash', id: 114, sectionKey: 'sec8' },
        { time: '17:43–17:47', title: 'Beyond Acquisition: Turning Astral-Scale Data into Discovery: A Modular GUI for DIA Proteomics Analysis in a Core Facility', author: 'Marta Isasa', type: 'flash', id: 116, sectionKey: 'sec4' },
        { time: '17:47–17:51', title: 'Optimizing tissue disruption strategies to characterize in vivo subcellular proteome remodelling', author: 'María Cinta Picos Mora', type: 'flash', id: 316, sectionKey: 'sec4' },
      ]},
      { time: '18:00–18:45', kind: 'social', title: 'Cocktail Reception + Sci BINGO — Young Investigators in Proteomics (SEPROT)', talks: [] },
    ]
  },
  thu: {
    label: 'Thu', date: '21 May', full: '21 May 2026 — Thursday',
    morning: [
      { time: '6:30–7:30', kind: 'social', title: 'Sunrise Run/Walk by the Beach', talks: [] },
      { time: '8:30–9:00', kind: 'invited', title: 'Invited Speaker — Enrique Santamaria — Olfactory proteomics: Emerging mechanisms and translational opportunities in neurological disorders', talks: [] },
      { time: '9:00–10:15', kind: 'section', title: 'Section 3 — Proteomics in the Clinic: From Biomarkers to Precision Medicine #2', chairs: 'Avais Daulat, Deborah Penque', sectionKey: 'sec3', talks: [
        { time: '9:00–9:15', title: 'Glycoproteomics uncovers a paucimannosylated proteome associated with tumour aggressiveness and poor clinical outcome in gastric cancer', author: 'Dylan Ferreira', type: 'oral', id: 201 },
        { time: '9:15–9:30', title: 'Artificial intelligence-based clinical models predict plasma proteomic endotypes enabling precision medicine in knee osteoarthritis', author: 'Patricia Quaranta Díaz', type: 'oral', id: 202 },
        { time: '9:30–9:45', title: 'Sciex Narrow-Window Scanning DIA: Redefining Selectivity and Quantitative Confidence in Proteomics with the SCIEX ZenoTOF 8600', author: 'Mário Armelão', type: 'sponsor', id: 203 },
        { time: '9:45–10:00', title: 'Proteomic biomarkers predictive of response to antiangiogenic treatment: toward personalized medicine in neovascular age-related macular degeneration', author: 'Antonio Cañizo Outeiriño', type: 'oral', id: 204 },
        { time: '10:00–10:15', title: 'Unravelling the proteome of human embryo implantation: new biomarkers and metabolic signatures', author: 'Girard Océane', type: 'oral', id: 205 },
      ]},
      { time: '10:15–11:00', kind: 'break', title: 'Coffee Break + Poster Session 2', talks: [] },
      { time: '11:00–11:30', kind: 'invited', title: 'Invited Speaker — Etienne Coyaud — Proximity labeling tools to investigate pathogenic protein networks', talks: [] },
      { time: '11:30–12:45', kind: 'section', title: 'Section 4 — Networks in Action: Interactomes, Signalling & Bioinformatics Innovation', chairs: 'Eduardo Chicano-Galvez, Montserrat Carrascal', sectionKey: 'sec4', talks: [
        { time: '11:30–11:45', title: 'Deciphering protein-protein interactions in live neurons using XL-MS', author: 'Hugo Gizardin-Fredon', type: 'oral', id: 206 },
        { time: '11:45–12:00', title: "Proteomic profiling of the interactome of phosphorylated Tau aggregates identifies modulators of Alzheimer's disease progression", author: 'Sofía Jiménez de Ocaña', type: 'oral', id: 207 },
        { time: '12:00–12:15', title: 'Bruker: Harvesting the potential of 4D-omics approaches with the timsTOF product range.', author: 'Pierre-Olivier Schmidt', type: 'sponsor', id: 208 },
        { time: '12:15–12:30', title: 'GLYCOAVATARS: Bead-coated membrane models for studying the cancer-immune cells interactome', author: 'Andreia Rafaela Linhares Miranda', type: 'oral', id: 209 },
        { time: '12:30–12:45', title: 'Orai1 facilitates angiogenesis after myocardial infarction through Notch1 signaling pathway', author: 'Isabel María Galeano Otero', type: 'oral', id: 210 },
      ]},
    ],
    afternoon: [
      { time: '12:45–14:30', kind: 'break', title: 'Lunch Break', talks: [] },
      { time: '13:30–14:00', kind: 'special', title: 'Sponsor Workshop: From Biosamples to Bioinsights — Bruker — Rafaelo Room (1st Floor)', talks: [] },
      { time: '14:00–14:30', kind: 'special', title: 'Sponsor Workshop — Thermo/Unicam — Rafaelo Room (1st Floor)', talks: [] },
      { time: '14:30–15:00', kind: 'invited', title: 'Invited Speaker — Ana Martinez del Val — Decoding Protein Function: How Proteomics Reveals Post-Translational Control in Cell Signalling and Disease', talks: [] },
      { time: '15:00–16:00', kind: 'section', title: 'Section 5 — PTMs: Deciphering the Dynamics of Protein Regulation', chairs: 'Hugo Osório, Avais Daulat', sectionKey: 'sec5', talks: [
        { time: '15:00–15:15', title: 'Experimental Design and Multivariate Analysis Approaches for Glycoproteomics', author: 'Estela Giménez López', type: 'oral', id: 301 },
        { time: '15:15–15:30', title: "Study of the links between the dysregulations of metabolism and epigenetics marks in Huntington's disease", author: 'Hisham Altoufaily', type: 'oral', id: 302 },
        { time: '15:30–15:45', title: 'Phosphoproteomics as a tool to dissect the molecular mechanisms underlying a novel combinatorial therapeutic strategy in pseudomyxoma peritonei', author: 'Antonio Romero-Ruiz', type: 'oral', id: 303 },
        { time: '15:45–16:00', title: 'Quantitative proteomic characterization of metastasis-associated succinylome in colorectal cancer', author: 'Raquel Rejas González', type: 'oral', id: 304 },
      ]},
      { time: '16:00–16:45', kind: 'break', title: 'Coffee Break + Poster Session 3 + Group Photo', talks: [] },
      { time: '16:45–17:15', kind: 'invited', title: 'Invited Speaker — Mélisande Blein-Nicolas — Proteomics as a cornerstone in deciphering the genotype-phenotype relationship in maize', talks: [] },
      { time: '17:15–18:30', kind: 'section', title: 'Section 6 — Proteomics Exploration in Non-Model Systems', chairs: 'Monserrat Carrascal, Ana Varela Coelho', sectionKey: 'sec6', talks: [
        { time: '17:15–17:30', title: 'Geographical origin differentiation of tiger nut (Cyperus Esculentus) through liquid chromatography-high resolution mass spectrometry analysis', author: 'Enrique Sentandreu', type: 'oral', id: 305 },
        { time: '17:30–17:45', title: 'Transforming Invasion into Innovation: Proteomics of Rugulopteryx okamurae for Monitoring, Degradation and Biomass Valorization', author: 'Almudena Escobar Niño', type: 'oral', id: 306 },
        { time: '17:45–18:00', title: 'Affinisep: High-Throughput SPE Membrane Approaches for Peptide Cleanup and Enrichment', author: 'Michel Artocarena', type: 'sponsor', id: 307 },
        { time: '18:00–18:15', title: 'Proteomic characterization of baculovirus expression vector system (BEVS)-derived extracellular vesicles engineered for Gla-Rich Protein (GRP) γ-carboxylation reveals selective GRP incorporation and distinct vesicle populations', author: 'Carla Alexandra São Bento Viegas', type: 'oral', id: 308 },
        { time: '18:15–18:30', title: 'Authentication of A2 bovine milk by routine LC-MS proteomic analysis', author: 'Lorea R. Beldarrain', type: 'oral', id: 309 },
      ]},
      { time: '18:30–19:02', kind: 'flash', title: 'Flash Presentations', sectionKey: 'sec5', talks: [
        { time: '18:30–18:34', title: 'Phenotypic remodelling of smooth muscle cells in atherosclerosis: a low-input and single-cell proteomics approach', author: 'David del Rio Aledo', type: 'flash', id: 112, sectionKey: 'sec5' },
        { time: '18:34–18:38', title: 'Multi-omics characterization of SIRT3 metabolism and its adaptation to the presence of amyloid-beta oligomers in nasal epithelial cells', author: 'Paz Cartas Cejudo', type: 'flash', id: 312, sectionKey: 'sec5' },
        { time: '18:38–18:42', title: 'Extending Proteome Profiling to Red Blood Cells using an Aptamer Platform', author: 'Luis André Botelho de Carvalho', type: 'flash', id: 313, sectionKey: 'sec7' },
        { time: '18:42–18:46', title: 'BiasTracker: a bioinformatics tool for quantifying physicochemical and functional biases in mass spectrometry-based proteomics', author: 'Gaelle Loutfi', type: 'flash', id: 113, sectionKey: 'sec7' },
        { time: '18:46–18:50', title: 'Comparative HLA-DR immunopeptidomics reveals disease- and genotype-associated signatures in rheumatoid arthritis', author: 'Jaxaira Maggi', type: 'flash', id: 314, sectionKey: 'sec8' },
        { time: '18:50–18:54', title: 'Scaling-up low input spatial proteomics using Evosep Whisper Zoom on the timsTOF Ultra AIP', author: 'Beatriz Rocha Loureda', type: 'flash', id: 315, sectionKey: 'sec2' },
        { time: '18:54–18:58', title: 'From Microbes to Ecosystems: Proteomic Insights into Agro-Environmental Interactions', author: 'Francisco Javier Fernandez Acero', type: 'flash', id: 117, sectionKey: 'sec6' },
      ]},
      { time: '20:30', kind: 'social', title: 'Conference Dinner (optional, subject to registration and payment)', talks: [] },
    ]
  },
  fri: {
    label: 'Fri', date: '22 May', full: '22 May 2026 — Friday',
    morning: [
      { time: '6:30–7:30', kind: 'social', title: 'Sunrise Run/Walk by the Beach', talks: [] },
      { time: '8:30–9:00', kind: 'invited', title: 'Invited Speaker — Celso Reis — Glycomics and glycoproteomics in cancer: from oncogenic mechanisms to clinical applications', talks: [] },
      { time: '9:00–10:15', kind: 'section', title: 'Section 7 — Quantitative and Computational Proteomics', chairs: 'Delphine Pflieger, Hugo Osório', sectionKey: 'sec7', talks: [
        { time: '9:00–9:15', title: 'Global protein turnover dynamics in pluripotency', author: 'Orhi Barroso Gomila', type: 'oral', id: 401 },
        { time: '9:15–9:30', title: 'Defining the Topology of Proteins in sEV Isolates by Protein Correlation Profiling', author: 'Joanes Etxeberria Ugartemendia', type: 'oral', id: 402 },
        { time: '9:30–9:45', title: 'Thermo/Unicam: Advanced applications for Orbitrap Astral Series MS', author: 'Bernard Delanghe', type: 'sponsor', id: 403 },
        { time: '9:45–10:00', title: 'Are Your Replicates Independent? — Defining Experimental Units in Primary Neuron Proteomics', author: 'Miguel Maria Varandas Anão Rosado', type: 'oral', id: 404 },
        { time: '10:00–10:15', title: 'Continuous telemetry-driven quality control for proactive LC–MS performance in proteomics core facilities', author: 'Daniel Lopez-Ferrer', type: 'oral', id: 405 },
      ]},
      { time: '10:15–11:00', kind: 'break', title: 'Coffee Break + Poster Session 4', talks: [] },
      { time: '11:00–11:30', kind: 'invited', title: 'Invited Speaker — Guadalupe Gómez Baena — Proteomics at the Service of Biodiversity Conservation', talks: [] },
      { time: '11:30–12:30', kind: 'section', title: 'Section 8 — Beyond Proteins: Small Molecules, Peptides & Integrated Omics + Environmental and Ecosystem Omics-Insights', chairs: 'Feliz Elortza, Deborah Penque', sectionKey: 'sec8', talks: [
        { time: '11:30–11:45', title: 'High-Throughput PISA–TMT Proteomics Enables Target Identification of Novel Antimicrobial Small Molecules', author: 'Gonçalo Raposo Matos', type: 'oral', id: 406 },
        { time: '11:45–12:00', title: 'Molecular responses of Staphylococcus epidermidis to pH and endogenous antimicrobial fatty acids are strain-specific', author: 'Ana Maria Varela Coelho', type: 'oral', id: 407 },
        { time: '12:00–12:15', title: 'Sewage protein information mining: A new frontier in community health and industrial surveillance', author: 'Montserrat Carrascal Perez', type: 'oral', id: 408 },
        { time: '12:15–12:30', title: 'Seasonal dynamics of urinary protein profiles in the Iberian Lynx (Lynx pardinus)', author: 'Beatriz Ortiz-Guisado', type: 'oral', id: 409 },
      ]},
      { time: '12:30', kind: 'special', title: 'Closing Session / Awards', talks: [] },
    ],
    afternoon: []
  }
}

export const POSTERS = [
  { posterNum: 'F1.01', title: 'In depth-analysis of Alzheimer\'s disease brain tissue reveals novel Aβ interactors', author: 'Ana Montero Calle', type: 'poster', id: 501, sectionKey: 'sec1' },
  { posterNum: 'F1.02', title: 'Proteomic and functional characterization of SLC8A1 in colorectal cancer development and metastasis', author: 'Sara Batuecas Domínguez', type: 'poster', id: 502, sectionKey: 'sec1' },
  { posterNum: 'F1.03', title: 'DIV Matters: Understanding Proteomic Shifts in Neuronal Maturation for Better Ischemic Modeling', author: 'Eva Maria Ferro Abril Monteiro', type: 'poster', id: 503, sectionKey: 'sec1' },
  { posterNum: 'F1.04', title: 'In-depth serum glycoproteomics reveals stage-dependent a2,6-sialylation and systemic prothrombotic signalling in gastric cancer', author: 'Lisandra Gabriela Fernandes Cruz', type: 'poster', id: 504, sectionKey: 'sec3' },
  { posterNum: 'F1.05', title: 'Comprehensive nucleolar proteome profiling reveals metastasis-associated remodeling in colorectal cancer', author: 'Elisa Carral Ibarra', type: 'poster', id: 505, sectionKey: 'sec3' },
  { posterNum: 'F1.06', title: 'When One is Enough: A Minimalistic \"On-Pot\" Proteomic Workflow for Global Profiling of Single Caenorhabditis elegans', author: 'Ibon Iloro Manzano', type: 'poster', id: 506, sectionKey: 'sec2' },
  { posterNum: 'F1.07', title: 'Scaling-up low input spatial proteomics using Evosep Whisper Zoom on the timsTOF Ultra AIP', author: 'Beatriz Rocha Loureda', type: 'poster', id: 507, sectionKey: 'sec2' },
  { posterNum: '1.08', title: 'Analysis of the involvement of GLG1 and BAIAP2 in colorectal cancer by functional proteomics', author: 'Ana García Romero', type: 'poster', id: 508, sectionKey: 'sec1' },
  { posterNum: '1.09', title: 'Proteomic differences between high- and low-grade medullary thyroid carcinomas', author: 'Alberto Peláez García', type: 'poster', id: 509, sectionKey: 'sec1' },
  { posterNum: '1.10', title: 'Functional proteomics characterization of neurochondrin in colorectal cancer', author: 'María Garranzo Asensio', type: 'poster', id: 510, sectionKey: 'sec1' },
  { posterNum: '1.11', title: 'Discovery of protein biomarkers for the diagnosis of Equine Metabolic Syndrome', author: 'Elisa Mª Espinosa López', type: 'poster', id: 511, sectionKey: 'sec1' },
  { posterNum: '1.12', title: 'Molecular signatures of Macrophage-to-foam cell transition induced by dyslipidemic and atherosclerotic serum', author: 'Jorge Cabañas Penagos', type: 'poster', id: 512, sectionKey: 'sec1' },
  { posterNum: '1.13', title: 'Functional characterization of the mitochondrial protein NDUFAF4 and implications in cholestasis', author: 'Américo Cerqueira Mateo', type: 'poster', id: 513, sectionKey: 'sec1' },
  { posterNum: '1.14', title: 'Advancing Plasma Proteomics Through a Next-Generation Single-Particle Enrichment Workflow for Deeper and More Quantitative Biomarker Discovery', author: 'Karin Yeoh', type: 'poster', id: 514, sectionKey: 'sec1' },
  { posterNum: '1.15', title: 'Secretomic profiling of triple-negative breast cancer media using Mag-Net™ HP', author: 'Previn Naicker', type: 'poster', id: 515, sectionKey: 'sec2' },
  { posterNum: '1.16', title: 'QuickFit DualStream: A plug-and-play dual-column ion source for high-throughput proteomics', author: 'Adolfo Fernandez Gomez de Enterria', type: 'poster', id: 516, sectionKey: 'sec2' },
  { posterNum: '1.17', title: 'Spatial single-cell proteomics on routine Papanicolaou-stained liquid-based cervical cytology', author: 'Laura Cantero González-Salazar', type: 'poster', id: 517, sectionKey: 'sec2' },
  { posterNum: 'F2.18', title: 'Beyond Acquisition: Turning Astral-ScaleData into Discovery: A modular GUI for DIA Proteomics Analysis in a Core Facility', author: 'Marta Isasa', type: 'poster', id: 518, sectionKey: 'sec4' },
  { posterNum: 'F2.19', title: 'Optimizing tissue disruption strategies to characterize in vivo subcellular proteome remodelling', author: 'María Cinta Picos Mora', type: 'poster', id: 519, sectionKey: 'sec4' },
  { posterNum: '2.20', title: 'Plasma proteomic biomarkers of Hutchinson–Gilford progeria syndrome: evidence from a mouse model', author: 'Inés Perales Sánchez', type: 'poster', id: 520, sectionKey: 'sec3' },
  { posterNum: '2.21', title: 'Exploring the molecular link between aortic stenosis and chronic kidney disease through DIA-PASEF-based plasma proteomics', author: 'Laura Mourino-Alvarez', type: 'poster', id: 521, sectionKey: 'sec3' },
  { posterNum: '2.22', title: 'Unique high-throughput workflow for deeper plasma/serum proteome coverage enables discovery of potential biomarkers', author: 'Ann-Christine König', type: 'poster', id: 522, sectionKey: 'sec3' },
  { posterNum: '2.23', title: 'Integrated serum proteomics and autoantibody profiling reveal a protein signature predictive of flare in rheumatoid arthritis during biologic tapering', author: 'Cristina Ruiz-Romero', type: 'poster', id: 523, sectionKey: 'sec3' },
  { posterNum: '2.24', title: 'CSF proteomic profiling for biomarker identification in patients with MCI', author: 'Daniela Araújo', type: 'poster', id: 524, sectionKey: 'sec3' },
  { posterNum: '2.25', title: 'Proteomic pathway alterations in mouse hippocampus and prefrontal cortex following chronic citalopram treatment', author: 'Verônica Techmeier Morato', type: 'poster', id: 525, sectionKey: 'sec3' },
  { posterNum: '2.26', title: 'Organ-specific proteomic response to semaglutide treatment in healthy mice', author: 'Lucía Beltrán Camacho', type: 'poster', id: 526, sectionKey: 'sec3' },
  { posterNum: '2.27', title: 'ML-Driven Clinical-Proteomics Identifies a 6-Protein Signature for Precise Atherosclerosis Stratification', author: 'MªCarmen Durán Ruiz', type: 'poster', id: 527, sectionKey: 'sec3' },
  { posterNum: '2.28', title: 'Proteomic landscape of the PBMCs from diabetic patients with and without diabetic complications: preliminary results', author: 'Josefa Benítez Camacho', type: 'poster', id: 528, sectionKey: 'sec3' },
  { posterNum: '2.29', title: 'Analysis of Plasma Depleted Samples for Chronic Diseases\' Biomarker Discovery with the Orbitrap Astral Mass Spectrometer', author: 'Rodrigo Barderas', type: 'poster', id: 529, sectionKey: 'sec3' },
  { posterNum: '2.30', title: 'Phenotypic characterization of breast cancer cells using stochastic proteomic profiling', author: 'Kamami Sarah', type: 'poster', id: 530, sectionKey: 'sec3' },
  { posterNum: '2.31', title: 'Novel Insights into Red Blood Cell Dysregulation in Obstructive Sleep Apnea: a multi-omic approach', author: 'Sofia Maria Sentieiro Neves', type: 'poster', id: 531, sectionKey: 'sec3' },
  { posterNum: '2.32', title: 'Pathophysiological subtypes of mild cognitive impairment due to Alzheimer\'s disease identified by CSF proteomics', author: 'Bruno Manadas', type: 'poster', id: 532, sectionKey: 'sec3' },
  { posterNum: '2.33', title: 'Changes at salivary proteomic level elicited by exposure to food odorants', author: 'Carla Sofia da Silva Simões', type: 'poster', id: 533, sectionKey: 'sec3' },
  { posterNum: '2.34', title: 'Proteome-Informed Therapeutic Prioritisation for Patient-Specific Prescriptomics in Muscle-Invasive Bladder', author: 'João de Matos Reis Aleixo Montes', type: 'poster', id: 534, sectionKey: 'sec3' },
  { posterNum: 'F3.35', title: 'Multi-omics characterization of SIRT3 metabolism and its adaptation to the presence of amyloid-beta oligomers in nasal epithelial cells', author: 'Paz Cartas Cejudo', type: 'poster', id: 535, sectionKey: 'sec5' },
  { posterNum: 'F3.36', title: 'Phenotypic remodelling of smooth muscle cells in atherosclerosis: a low-input and single-cell proteomics approach', author: 'David del Rio Aledo', type: 'poster', id: 536, sectionKey: 'sec5' },
  { posterNum: 'F3.37', title: 'From Microbes to Ecosystems: Proteomic Insights into Agro-Environmental Interactions', author: 'Francisco Javier Fernandez Acero', type: 'poster', id: 537, sectionKey: 'sec6' },
  { posterNum: '3.38', title: 'High-sensitivity N-glycopeptide identification in human plasma using electron-activated dissociation', author: 'Javier Lago Nuñez', type: 'poster', id: 538, sectionKey: 'sec5' },
  { posterNum: '3.30', title: 'Fast and robust phosphoproteomics sample prep with AttractSPE® Disks C18 Tips for high phosphopeptide recovery and identification', author: 'Michel Arotcarena', type: 'poster', id: 539, sectionKey: 'sec5' },
  { posterNum: '3.40', title: 'Small-molecule post-translational modification in Chlamydomonas reinhardtii', author: 'Víctor García-Riaño Domínguez', type: 'poster', id: 540, sectionKey: 'sec5' },
  { posterNum: '3.41', title: 'Comparison of Strategies for Global Glycoprotein Profiling by LC-MS', author: 'Javier Beaskoetxea Lejarzegi', type: 'poster', id: 541, sectionKey: 'sec5' },
  { posterNum: '3.42', title: 'Sequential analysis of differential protein abundance, glycosylation and phosphorylation in WNT7A overexpressing MDA231 cells', author: 'Mikel Azkargorta', type: 'poster', id: 542, sectionKey: 'sec5' },
  { posterNum: '3.43', title: 'Exploring glycosylation alterations during atherosclerosis progression', author: 'Emilio Camafeita', type: 'poster', id: 543, sectionKey: 'sec5' },
  { posterNum: '3.44', title: 'Preconditioning therapy prevents site-specific oxidation of Trp/Cys redox sensors in contractile and metabolic cardiac proteins', author: 'Inmaculada Jorge Cerrudo', type: 'poster', id: 544, sectionKey: 'sec5' },
  { posterNum: '3.45', title: 'VPS4A validation as a Parkin substrate', author: 'Ainhoa Atxa Espiga', type: 'poster', id: 545, sectionKey: 'sec5' },
  { posterNum: '3.46', title: 'Metaproteomics in an Archaeological Environment: A Pipeline for Deciphering Ancient Remains', author: 'María Luz Valero Rustarazo', type: 'poster', id: 546, sectionKey: 'sec6' },
  { posterNum: '3.47', title: 'Seasonal protein variations of wild boar meat', author: 'Miguel Angel Sentandreu', type: 'poster', id: 547, sectionKey: 'sec6' },
  { posterNum: '3.48', title: 'Tracking 10 Stages of a Fruit Fly\'s Life Cycle with High-Throughput Proteomics', author: 'Iraide Escobés Corcuera', type: 'poster', id: 548, sectionKey: 'sec6' },
  { posterNum: '3.49', title: 'Secretome analysis to understand the intracellular traffic networks in fungi', author: 'Silvia Rodríguez Pires', type: 'poster', id: 549, sectionKey: 'sec6' },
  { posterNum: 'F4.50', title: 'Extending Proteome Profiling to Red Blood Cells using an Aptamer Platform', author: 'Luis André Botelho de Carvalho', type: 'poster', id: 550, sectionKey: 'sec7' },
  { posterNum: 'F4.51', title: 'BiasTracker: a bioinformatics tool for quantifying physicochemical and functional biases in mass spectrometry-based proteomics', author: 'Gaelle Loutfi', type: 'poster', id: 551, sectionKey: 'sec7' },
  { posterNum: 'F4.52', title: 'Comparative HLA-DR immunopeptidomics reveals disease- and genotype-associated signatures in rheumatoid arthritis', author: 'Jaxaira Maggi', type: 'poster', id: 552, sectionKey: 'sec8' },
  { posterNum: 'F4.53', title: 'MALDI-MSI as a Platform for Spatial Multi-Omics in Glioblastoma Research', author: 'Cristina María López Vázquez', type: 'poster', id: 553, sectionKey: 'sec8' },
  { posterNum: '4.54', title: 'Plasma Proteome Equalization Uncovers Dysregulated Proteostasis and Amyloidogenic Pathways in Multiple Myeloma', author: 'Inês de Freitas Domingos', type: 'poster', id: 554, sectionKey: 'sec7' },
  { posterNum: '4.55', title: 'Towards the Development of a Liquid Chromatography Free Workflow for Measurement of Clinically Important Proteins', author: 'Pierre-Olivier Schmit', type: 'poster', id: 555, sectionKey: 'sec7' },
  { posterNum: '4.56', title: 'Universal pipeline unlocking inter taxonomic differential abundance analyses: Brain matrisome characterization across mouse, ferret and human', author: 'Gianluca Arauz Garofalo', type: 'poster', id: 556, sectionKey: 'sec7' },
  { posterNum: '4.57', title: 'Proteomic Signatures Rescued by Two Candidate Molecules in a Zebrafish Model of CDKL5 Deficiency Disorder', author: 'Márcio Alexandre Filipe Simão', type: 'poster', id: 557, sectionKey: 'sec7' },
  { posterNum: '4.58', title: 'Label Free Quantitative Proteomics reveals MAM remodeling and inmunometabolic adaptation in LPS-activated Microglia', author: 'Vivian de los Ríos Benítez', type: 'poster', id: 558, sectionKey: 'sec7' },
  { posterNum: '4.59', title: 'Quantitative DIA-PASEF proteomic profiling reveals molecular alterations in a murine model of retinopathy of prematurity', author: 'Viviane de Almeida Bastos', type: 'poster', id: 559, sectionKey: 'sec7' },
  { posterNum: '4.60', title: 'Kuiper enables effective, fast and reliable library-free analysis of DIA Immunopeptidomics data', author: 'Jorge Peinado-Izaguerri', type: 'poster', id: 560, sectionKey: 'sec7' },
  { posterNum: '4.61', title: 'Ultrasound-Assisted Dental Peptidomics Reveals Integrated Host, Dietary, and Microbial Signatures', author: 'Raquel Inês Oliveira Lourenço da Fonseca', type: 'poster', id: 561, sectionKey: 'sec8' },
  { posterNum: '4.62', title: 'Exploring the proteomics capabilities of a new Trapped Ion Mobility Q-TOF designed for enhanced metabolomics performances', author: 'Pedro Cano', type: 'poster', id: 562, sectionKey: 'sec8' },
  { posterNum: '4.63', title: 'Red blood cell modulation in response to COVID-19 vaccination – A multiomics study', author: 'Joana Saraiva', type: 'poster', id: 563, sectionKey: 'sec8' },
]

export const ALL_PRES = {}
Object.values(PROGRAMME).forEach(day => {
  ;['morning','afternoon'].forEach(half => {
    ;(day[half] || []).forEach(block => {
      ;(block.talks || []).forEach(t => {
        if (!t.id) return
        // Include all talks except sponsor talks in the voting area
        if (t.type !== 'sponsor') ALL_PRES[t.id] = { ...t, sectionKey: t.sectionKey || block.sectionKey }
      })
    })
  })
})
// Add posters to ALL_PRES
POSTERS.forEach(p => { ALL_PRES[p.id] = p })

export const SECTIONS = [
  { key: 'sec1', label: 'Section 1', short: 'Sec 1', icon: '1', desc: 'Proteomics in the Clinic — Biomarkers to Precision Medicine #1 (Wed)' },
  { key: 'sec2', label: 'Section 2', short: 'Sec 2', icon: '2', desc: 'Next-Gen Proteomics: Single-Cell, Proteogenomics & Disruptive Technologies (Wed)' },
  { key: 'sec3', label: 'Section 3', short: 'Sec 3', icon: '3', desc: 'Proteomics in the Clinic — Biomarkers to Precision Medicine #2 (Thu)' },
  { key: 'sec4', label: 'Section 4', short: 'Sec 4', icon: '4', desc: 'Networks in Action: Interactomes, Signalling & Bioinformatics Innovation (Thu)' },
  { key: 'sec5', label: 'Section 5', short: 'Sec 5', icon: '5', desc: 'PTMs: Deciphering the Dynamics of Protein Regulation (Thu)' },
  { key: 'sec6', label: 'Section 6', short: 'Sec 6', icon: '6', desc: 'Proteomics Exploration in Non-Model Systems (Thu)' },
  { key: 'sec7', label: 'Section 7', short: 'Sec 7', icon: '7', desc: 'Quantitative and Computational Proteomics (Fri)' },
  { key: 'sec8', label: 'Section 8', short: 'Sec 8', icon: '8', desc: 'Beyond Proteins: Small Molecules, Peptides & Integrated Omics + Environmental Omics (Fri)' },
]
