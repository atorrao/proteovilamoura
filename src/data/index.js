export const ADMIN_PASS = 'admin123'

export const PROGRAMME = {
  wed: {
    label: 'Wed', date: '20 May', full: '20 May 2026 — Wednesday',
    morning: [
      { time: '9:30–12:00', kind: 'special', title: 'Pre-congress course (Optional): Practical Introduction to Python Programming — Diego Mena Santos · Samuel Lozano Juárez', talks: [] },
      { time: '11:00', kind: 'break', title: 'Registration', talks: [] },
      { time: '13:00', kind: 'special', title: 'Welcoming Session', talks: [] },
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
      { time: '16:15–17:15', kind: 'section', title: 'Section 2 — Next-Gen Proteomics: Single-Cell, Proteogenomics & Disruptive Technologies', chairs: 'Deborah Penque, Félix Elortza', sectionKey: 'sec2', talks: [
        { time: '16:15–16:30', title: 'Integrative single-cell proteomics identifies pro-regenerative fingerprints in a sub-population of adult cardiomyocytes', author: 'Consuelo Marin-Vicente', type: 'oral', id: 106 },
        { time: '16:30–16:45', title: 'Sponsor Talk (TBD)', author: '', type: 'sponsor', id: 107 },
        { time: '16:45–17:00', title: 'Benchmarking single-cell FACS-assisted strategies: effects on cellular component bias and post-translational modification detection', author: 'Samuel Lozano Juárez', type: 'oral', id: 108 },
        { time: '17:00–17:15', title: 'Sponsor Talk (TBD)', author: '', type: 'sponsor', id: 109 },
      ]},
      { time: '17:15–18:10', kind: 'flash', title: 'Flash Presentations — Section 2', sectionKey: 'sec2', talks: [
        { time: '17:15–17:19', title: "In depth-analysis of Alzheimer's disease brain tissue reveals novel Aβ interactors", author: 'Ana Montero Calle', type: 'flash', id: 110 },
        { time: '17:19–17:23', title: 'Proteomic and functional characterization of SLC8A1 in colorectal cancer development and metastasis', author: 'Sara Batuecas Domínguez', type: 'flash', id: 111 },
        { time: '17:23–17:27', title: 'Phenotypic remodelling of smooth muscle cells in atherosclerosis: a low-input and single-cell proteomics approach', author: 'David del Rio Aledo', type: 'flash', id: 112 },
        { time: '17:27–17:31', title: 'BiasTracker: a bioinformatics tool for quantifying physicochemical and functional biases in mass spectrometry-based proteomics', author: 'Gaelle Loutfi', type: 'flash', id: 113 },
        { time: '17:31–17:35', title: 'MALDI-MSI as a Platform for Spatial Multi-Omics in Glioblastoma Research', author: 'Cristina María López Vázquez', type: 'flash', id: 114 },
        { time: '17:35–17:39', title: 'When One is Enough: A Minimalistic "On-Pot" Proteomic Workflow for Global Profiling of Single Caenorhabditis elegans', author: 'Ibon Iloro Manzano', type: 'flash', id: 115 },
        { time: '17:39–17:43', title: 'Beyond Acquisition: Turning Astral-Scale Data into Discovery: A Modular GUI for DIA Proteomics Analysis in a Core Facility', author: 'Marta Isasa', type: 'flash', id: 116 },
        { time: '17:43–17:47', title: 'From Microbes to Ecosystems: Proteomic Insights into Agro-Environmental Interactions', author: 'Francisco Javier Fernandez Acero', type: 'flash', id: 117 },
        { time: '17:47–17:51', title: 'DIV Matters: Understanding Proteomic Shifts in Neuronal Maturation for Better Ischemic Modeling', author: 'Eva Ferro', type: 'flash', id: 118 },
      ]},
      { time: '18:00–18:45', kind: 'social', title: 'Cocktail Reception + Sci BINGO — Young Investigators in Proteomics (SEPROT)', talks: [] },
    ]
  },
  thu: {
    label: 'Thu', date: '21 May', full: '21 May 2026 — Thursday',
    morning: [
      { time: '6:30–7:30', kind: 'social', title: 'Sunrise Run/Walk by the Beach', talks: [] },
      { time: '8:00–8:30', kind: 'special', title: 'Sponsor Talk (TBD)', talks: [] },
      { time: '8:30–9:00', kind: 'invited', title: 'Invited Speaker — Enrique Santamaria — Olfactory proteomics: Emerging mechanisms and translational opportunities in neurological disorders', talks: [] },
      { time: '9:00–10:15', kind: 'section', title: 'Section 3 — Proteomics in the Clinic: From Biomarkers to Precision Medicine #2', chairs: 'Paulo Marcelo, Deborah Penque', sectionKey: 'sec3', talks: [
        { time: '9:00–9:15', title: 'Glycoproteomics uncovers a paucimannosylated proteome associated with tumour aggressiveness and poor clinical outcome in gastric cancer', author: 'Dylan Ferreira', type: 'oral', id: 201 },
        { time: '9:15–9:30', title: 'Artificial intelligence-based clinical models predict plasma proteomic endotypes enabling precision medicine in knee osteoarthritis', author: 'Patricia Quaranta Díaz', type: 'oral', id: 202 },
        { time: '9:30–9:45', title: 'Sponsor Talk (TBD)', author: '', type: 'sponsor', id: 203 },
        { time: '9:45–10:00', title: 'Proteomic biomarkers predictive of response to antiangiogenic treatment: toward personalized medicine in neovascular age-related macular degeneration', author: 'Antonio Cañizo Outeiriño', type: 'oral', id: 204 },
        { time: '10:00–10:15', title: 'Unravelling the proteome of human embryo implantation: new biomarkers and metabolic signatures', author: 'Girard Océane', type: 'oral', id: 205 },
      ]},
      { time: '10:15–11:00', kind: 'break', title: 'Coffee Break + Poster Session 1', talks: [] },
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
      { time: '13:30–14:00', kind: 'special', title: 'Sponsor Workshop (TBD) — Rafaelo Room', talks: [] },
      { time: '14:00–14:30', kind: 'special', title: 'Sponsor Workshop (TBD) — Rafaelo Room', talks: [] },
      { time: '14:30–15:00', kind: 'invited', title: 'Invited Speaker — Ana Martinez del Val — Decoding Protein Function: How Proteomics Reveals Post-Translational Control in Cell Signalling and Disease', talks: [] },
      { time: '15:00–16:00', kind: 'section', title: 'Section 5 — PTMs: Deciphering the Dynamics of Protein Regulation', chairs: 'Hugo Osório, Avais Daulat', sectionKey: 'sec5', talks: [
        { time: '15:00–15:15', title: 'Experimental Design and Multivariate Analysis Approaches for Glycoproteomics', author: 'Estela Giménez López', type: 'oral', id: 301 },
        { time: '15:15–15:30', title: "Study of the links between the dysregulations of metabolism and epigenetics marks in Huntington's disease", author: 'Hisham Altoufaily', type: 'oral', id: 302 },
        { time: '15:30–15:45', title: 'Phosphoproteomics as a tool to dissect the molecular mechanisms underlying a novel combinatorial therapeutic strategy in pseudomyxoma peritonei', author: 'Antonio Romero-Ruiz', type: 'oral', id: 303 },
        { time: '15:45–16:00', title: 'Quantitative proteomic characterization of metastasis-associated succinylome in colorectal cancer', author: 'Raquel Rejas González', type: 'oral', id: 304 },
      ]},
      { time: '16:00–16:45', kind: 'break', title: 'Coffee Break + Poster Session 2 + Group Photo', talks: [] },
      { time: '16:45–17:15', kind: 'invited', title: 'Invited Speaker — Mélisande Blein-Nicolas — Proteomics as a cornerstone in deciphering the genotype-phenotype relationship in maize', talks: [] },
      { time: '17:15–18:30', kind: 'section', title: 'Section 6 — Proteomics Exploration in Non-Model Systems', chairs: 'Montserrat Carrascal, Ana Varela Coelho', sectionKey: 'sec6', talks: [
        { time: '17:15–17:30', title: 'Geographical origin differentiation of tiger nut (Cyperus Esculentus) through liquid chromatography-high resolution mass spectrometry analysis', author: 'Enrique Sentandreu', type: 'oral', id: 305 },
        { time: '17:30–17:45', title: 'Transforming Invasion into Innovation: Proteomics of Rugulopteryx okamurae for Monitoring, Degradation and Biomass Valorization', author: 'Almudena Escobar Niño', type: 'oral', id: 306 },
        { time: '17:45–18:00', title: 'Sponsor Talk (TBD)', author: '', type: 'sponsor', id: 307 },
        { time: '18:00–18:15', title: 'Proteomic characterization of baculovirus expression vector system (BEVS)-derived extracellular vesicles engineered for Gla-Rich Protein (GRP) γ-carboxylation reveals selective GRP incorporation and distinct vesicle populations', author: 'Carla Alexandra São Bento Viegas', type: 'oral', id: 308 },
        { time: '18:15–18:30', title: 'Authentication of A2 bovine milk by routine LC-MS proteomic analysis', author: 'Lorea R. Beldarrain', type: 'oral', id: 309 },
      ]},
      { time: '18:30–19:02', kind: 'flash', title: 'Flash Presentations — Section 6', sectionKey: 'sec6', talks: [
        { time: '18:30–18:34', title: 'Comprehensive nucleolar proteome profiling reveals metastasis-associated remodeling in colorectal cancer', author: 'Elisa Carral Ibarra', type: 'flash', id: 310 },
        { time: '18:34–18:38', title: 'In-depth serum glycoproteomics reveals stage-dependent a2,6-sialylation and systemic prothrombotic signalling in gastric cancer', author: 'Lisandra Gabriela Fernandes Cruz', type: 'flash', id: 311 },
        { time: '18:38–18:42', title: 'Multi-omics characterization of SIRT3 metabolism and its adaptation to the presence of amyloid-beta oligomers in nasal epithelial cells', author: 'Paz Cartas Cejudo', type: 'flash', id: 312 },
        { time: '18:42–18:46', title: 'Extending Proteome Profiling to Red Blood Cells using an Aptamer Platform', author: 'Luis André Botelho de Carvalho', type: 'flash', id: 313 },
        { time: '18:46–18:50', title: 'Comparative HLA-DR immunopeptidomics reveals disease- and genotype-associated signatures in rheumatoid arthritis', author: 'Jaxaira Maggi', type: 'flash', id: 314 },
        { time: '18:50–18:54', title: 'Scaling-up low input spatial proteomics using Evosep Whisper Zoom on the timsTOF Ultra AIP', author: 'Beatriz Rocha Loureda', type: 'flash', id: 315 },
        { time: '18:54–18:58', title: 'Optimizing tissue disruption strategies to characterize in vivo subcellular proteome remodelling', author: 'María Cinta Picos Mora', type: 'flash', id: 316 },
      ]},
      { time: '20:00', kind: 'social', title: 'Conference Dinner (optional, subject to registration and payment)', talks: [] },
    ]
  },
  fri: {
    label: 'Fri', date: '22 May', full: '22 May 2026 — Friday',
    morning: [
      { time: '6:30–7:30', kind: 'social', title: 'Sunrise Run/Walk by the Beach', talks: [] },
      { time: '8:00–8:30', kind: 'special', title: 'Sponsor Talk (TBD)', talks: [] },
      { time: '8:30–9:00', kind: 'invited', title: 'Invited Speaker — Celso Reis — Glycomics and glycoproteomics in cancer: from oncogenic mechanisms to clinical applications', talks: [] },
      { time: '9:00–10:15', kind: 'section', title: 'Section 7 — Quantitative and Computational Proteomics', chairs: 'Delphine Pflieger, Paulo Marcelo', sectionKey: 'sec7', talks: [
        { time: '9:00–9:15', title: 'Global protein turnover dynamics in pluripotency', author: 'Orhi Barroso Gomila', type: 'oral', id: 401 },
        { time: '9:15–9:30', title: 'Defining the Topology of Proteins in sEV Isolates by Protein Correlation Profiling', author: 'Joanes Etxeberria Ugartemendia', type: 'oral', id: 402 },
        { time: '9:30–9:45', title: 'Sponsor Talk (TBD)', author: '', type: 'sponsor', id: 403 },
        { time: '9:45–10:00', title: 'Are Your Replicates Independent? — Defining Experimental Units in Primary Neuron Proteomics', author: 'Miguel Maria Varandas Anão Rosado', type: 'oral', id: 404 },
        { time: '10:00–10:15', title: 'Continuous telemetry-driven quality control for proactive LC–MS performance in proteomics core facilities', author: 'Daniel Lopez-Ferrer', type: 'oral', id: 405 },
      ]},
      { time: '10:15–11:00', kind: 'break', title: 'Coffee Break + Poster Session 2', talks: [] },
      { time: '11:00–11:30', kind: 'invited', title: 'Invited Speaker — Guadalupe Gómez Baena — Proteomics at the Service of Biodiversity Conservation', talks: [] },
      { time: '11:30–12:30', kind: 'section', title: 'Section 8 — Beyond Proteins: Small Molecules, Peptides & Integrated Omics + Environmental and Ecosystem Omics', chairs: 'Félix Elortza, Paulo Marcelo', sectionKey: 'sec8', talks: [
        { time: '11:30–11:45', title: 'High-Throughput PISA–TMT Proteomics Enables Target Identification of Novel Antimicrobial Small Molecules', author: 'Gonçalo Raposo Matos', type: 'oral', id: 406 },
        { time: '11:45–12:00', title: 'Molecular responses of Staphylococcus epidermidis to pH and endogenous antimicrobial fatty acids are strain-specific', author: 'Ana Maria Varela Coelho', type: 'oral', id: 407 },
        { time: '12:00–12:15', title: 'Sewage protein information mining: A new frontier in community health and industrial surveillance', author: 'Montserrat Carrascal Perez', type: 'oral', id: 408 },
        { time: '12:15–12:30', title: 'Seasonal dynamics of urinary protein profiles in the Iberian Lynx (Lynx pardinus)', author: 'Beatriz Ortiz-Guisado', type: 'oral', id: 409 },
      ]},
    ],
    afternoon: [
      { time: '12:30', kind: 'special', title: 'Closing Session / Awards', talks: [] },
      { time: '13:00–13:30', kind: 'special', title: 'Procura Session', talks: [] },
    ]
  }
}

export const ALL_PRES = {}
Object.values(PROGRAMME).forEach(day => {
  ;['morning','afternoon'].forEach(half => {
    ;(day[half] || []).forEach(block => {
      ;(block.talks || []).forEach(t => {
        if (!t.id) return
        // Include all talks except sponsor talks in the voting area
        if (t.type !== 'sponsor') ALL_PRES[t.id] = { ...t, sectionKey: block.sectionKey }
      })
    })
  })
})

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
