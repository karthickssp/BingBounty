let searchInterval;
let searchesRemaining = 0;
let currentIndex = 0;
let searchesThisCycle = 0; // Track searches in the current cycle
const maxSearchesPerCycle = 3; // Perform 3 searches within the 15 minutes
const restPeriod = 900000; // 15 minutes in milliseconds (900,000)

const topics = [
  "algorithm", "antibody", "architecture", "asteroid", "bacterium", "biodiversity", "biosphere", "blockchain",
  "calculus", "catalyst", "cellulose", "chromosome", "climate", "cognition", "computation", "conifer",
  "corrosion", "cybersecurity", "data", "database", "decibel", "dendrite", "density", "deposition", "ecosystem",
  "electricity", "enzyme", "evolution", "galaxy", "genome", "geothermal", "gravity", "hemoglobin", "hormone",
  "hydrology", "inertia", "intelligence", "isotope", "kinetics", "lightyear", "molecule", "nanotechnology",
  "nucleus", "optics", "organism", "paleontology", "photosynthesis", "physics", "plasma", "protein", "quantum",
  "radiation", "respiration", "robotics", "satellite", "simulation", "solar", "spectrum", "sustainability",
  "telescope", "thermal", "turbine", "vaccine", "virus", "waveform", "xenon", "zygote", "aerodynamics",
  "algorithmic", "anatomy", "antioxidant", "astrophysics", "atmosphere", "bacteria", "bauxite", "biodegradable",
  "bionics", "botany", "byte", "carbohydrate", "cardiology", "chemical", "circuit", "classical", "cloning",
  "conduction", "conservation", "crustacean", "cytoplasm", "datalogy", "diatomic", "dichotomy", "diffusion",
  "dinosaur", "dna", "ecology", "economics", "electron", "element", "engineering", "entomology", "environment",
  "ethics", "fiber", "fungi", "fusion", "galileo", "gene", "geography", "geophysics", "giant", "gravity",
  "hemisphere", "hormonal", "hypothesis", "immunology", "innovation", "insulin", "invertebrate", "irrigation",
  "jurassic", "lactose", "lithosphere", "magnetic", "meteor", "microbiology", "microscope", "mitosis", "mutation",
  "natural", "nitrate", "nutrient", "optical", "organ", "osmosis", "pathogen", "pH", "photon", "phylum",
  "physiotherapy", "plankton", "plate", "polymer", "preservation", "propulsion", "proton", "radioactivity",
  "reaction", "refraction", "reproduction", "resistance", "resonance", "seismology", "software", "solution",
  "species", "subatomic", "synergy", "systematic", "taxonomy", "technology", "temperature", "transmission",
  "ultrasound", "universe", "vertebrate", "vibration", "volcanology", "wavelength", "xylem", "yolk", "yield",
  "zoology", "adrenaline", "affinity", "agriculture", "alloy", "alternative", "amino", "anemometer", "annual",
  "arithmetic", "array", "atmospheric", "barometer", "biopsy", "blood", "borealis", "brain", "cancer", "capillary",
  "carbon", "carnivore", "catastrophe", "cell", "centrifugal", "chameleon", "chemical", "chlorophyll", "chromium",
  "circulation", "climatology", "coagulant", "cognitive", "comet", "compass", "compost", "compression", "compound",
  "conduction", "constellation", "contaminant", "control", "convection", "convergent", "cosmic", "cranium",
  "crystal", "cylinder", "cytoplasmic", "decay", "decibel", "deduction", "density", "deoxyribonucleic", "detritus",
  "diffraction", "disease", "domesticate", "doppler", "drift", "earthquake", "echinoderm", "eclipse", "ecosystem",
  "efficiency", "electromagnetic", "electron", "electrophoresis", "elimination", "elemental", "embryology",
  "emission", "enzyme", "epidemiology", "equator", "erosion", "exponential", "factorial", "farming", "fertilization",
  "fertility", "filament", "fission", "fossil", "fungal", "fusion", "galvanize", "genetic", "geology", "geothermal",
  "glacier", "granite", "gravitational", "habitat", "herbivore", "heredity", "heterogeneous", "homogeneous",
  "hydraulic", "hydrogen", "immunoglobulin", "infectious", "influenza", "inorganic", "ion", "isotope", "kinetic",
  "laboratory", "landslide", "lateral", "latitude", "lava", "leaf", "levitation", "limestone", "lithium", "luminescence",
  "magnesium", "magnify", "magnitude", "mammal", "marsupial", "matter", "meiosis", "mercury", "metabolism",
  "metamorphosis", "meteorology", "methane", "microscopic", "mineral", "mitochondria", "molecule", "momentum",
  "monomer", "morphology", "mutation", "natural", "nebula", "neutron", "niche", "nucleic", "nucleus", "nutrient",
  "observatory", "organic", "organism", "osmosis", "oxidation", "oxygen", "ozone", "pandemic", "parasitic", "particle",
  "petrify", "phenomenon", "photosphere", "phylum", "planetary", "plasma", "platelet", "pollution", "positron",
  "potential", "precipitate", "protein", "psychology", "quarantine", "quark", "radiation", "radio", "rainforest",
  "reactant", "reagent", "recycle", "refraction", "regeneration", "respiratory", "saline", "satellite", "sediment",
  "seismic", "solstice", "species", "spectrum", "sperm", "spinal", "spore", "sterilization", "stratosphere", "subspecies",
  "sunspot", "surface", "symbiosis", "synthesis", "taxonomy", "telescopic", "temperature", "terrestrial", "topography",
  "toxicity", "transistor", "turbine", "ultraviolet", "vascular", "vector", "velocity", "vibration", "virus", "volcano",
  "wavelength", "weather", "xenon", "yield", "yolk", "zoology", "absorption", "acoustics", "adaptation", "airflow",
  "airmass", "alveoli", "amplitude", "angstrom", "antibody", "antigen", "antiseptic", "anvil", "arc", "archaeology",
  "artery", "ash", "asterism", "atmosphere", "atom", "bacteriophage", "bar", "baseline", "beaker", "behavior",
  "bell", "bioinformatics", "biome", "bipolar", "bit", "biogeography", "biophysics", "botanical", "cadmium",
  "calorie", "capillary", "capsid", "carbonyl", "carotenoid", "cartilage", "catalysis", "catheter", "cellular",
  "cephalopod", "charge", "chloride", "chordate", "chromatography", "cloning", "cognitive", "colloid", "commensal",
  "congenital", "conservation", "continental", "crust", "cybernetics", "dendrology", "density", "detonation",
  "dialysis", "dielectric", "diffraction", "digital", "diode", "distill", "dopamine", "double", "ecological",
  "ejection", "elasticity", "electrolysis", "endocrine", "energy", "epigenetics", "erosion", "ethology", "evaporation",
  "evolution", "exponential", "exposure", "fermentation", "field", "filament", "filter", "fireball", "fission",
  "flora", "folding", "frequency", "fusion", "genetics", "genome", "geochemistry", "glucose", "granite", "greenhouse",
  "hematology", "hemisphere", "herbaceous", "hertz", "hydrosphere", "ionize", "ions", "iron", "isotonic", "joule",
  "kelvin", "keystone", "latitude", "lignite", "liquid", "magma", "magnesium", "magnet", "mars", "melanin",
  "membrane", "mendelevium", "metabolism", "metamorphic", "methane", "microscope", "mitosis", "mole", "momentum",
  "mutation", "natural", "nerve", "neutron", "noble", "node", "nucleus", "nutrient", "oceanography", "optics",
  "osmosis", "oxidant", "oxygen", "parasitology", "particle", "period", "phosphorus", "physiology", "pollination",
  "polymer", "potassium", "pyramid", "pyrite", "radar", "radiocarbon", "radiology", "radiowave", "recycling",
  "respiration", "seismology", "sequence", "silica", "sodium", "soil", "species", "spectrograph", "subduction",
  "sulfur", "sustainable", "synthesis", "tectonics", "temperature", "thrombosis", "transpiration", "trophic",
  "ultrasound", "vertebrate", "virus", "vortex", "wave", "weather", "wavelength", "xylem", "yield", "yolk", "zoological",
  "algorithm", "antibody", "architecture", "asteroid", "bacterium", "biodiversity", "biosphere", "blockchain",
  "calculus", "catalyst", "cellulose", "chromosome", "climate", "cognition", "computation", "conifer",
  "corrosion", "cybersecurity", "data", "database", "decibel", "dendrite", "density", "deposition", "ecosystem",
  "electricity", "enzyme", "evolution", "galaxy", "genome", "geothermal", "gravity", "hemoglobin", "hormone",
  "hydrology", "inertia", "intelligence", "isotope", "kinetics", "lightyear", "molecule", "nanotechnology",
  "nucleus", "optics", "organism", "paleontology", "photosynthesis", "physics", "plasma", "protein", "quantum",
  "radiation", "respiration", "robotics", "satellite", "simulation", "solar", "spectrum", "sustainability",
  "telescope", "thermal", "turbine", "vaccine", "virus", "waveform", "xenon", "zygote", "aerodynamics",
  "algorithmic", "anatomy", "antioxidant", "astrophysics", "atmosphere", "bacteria", "bauxite", "biodegradable",
  "bionics", "botany", "byte", "carbohydrate", "cardiology", "chemical", "circuit", "classical", "cloning",
  "conduction", "conservation", "crustacean", "cytoplasm", "datalogy", "diatomic", "dichotomy", "diffusion",
  "dinosaur", "dna", "ecology", "economics", "electron", "element", "engineering", "entomology", "environment",
  "ethics", "fiber", "fungi", "fusion", "galileo", "gene", "geography", "geophysics", "giant", "gravity",
  "hemisphere", "hormonal", "hypothesis", "immunology", "innovation", "insulin", "invertebrate", "irrigation",
  "jurassic", "lactose", "lithosphere", "magnetic", "meteor", "microbiology", "microscope", "mitosis", "mutation",
  "natural", "nitrate", "nutrient", "optical", "organ", "osmosis", "pathogen", "pH", "photon", "phylum",
  "physiotherapy", "plankton", "plate", "polymer", "preservation", "propulsion", "proton", "radioactivity",
  "reaction", "refraction", "reproduction", "resistance", "resonance", "seismology", "software", "solution",
  "species", "subatomic", "synergy", "systematic", "taxonomy", "technology", "temperature", "transmission",
  "ultrasound", "universe", "vertebrate", "vibration", "volcanology", "wavelength", "xylem", "yolk", "yield",
  "zoology", "adrenaline", "affinity", "agriculture", "alloy", "alternative", "amino", "anemometer", "annual",
  "arithmetic", "array", "atmospheric", "barometer", "biopsy", "blood", "borealis", "brain", "cancer", "capillary",
  "carbon", "carnivore", "catastrophe", "cell", "centrifugal", "chameleon", "chemical", "chlorophyll", "chromium",
  "circulation", "climatology", "coagulant", "cognitive", "comet", "compass", "compost", "compression", "compound",
  "conduction", "constellation", "contaminant", "control", "convection", "convergent", "cosmic", "cranium",
  "crystal", "cylinder", "cytoplasmic", "decay", "decibel", "deduction", "density", "deoxyribonucleic", "detritus",
  "diffraction", "disease", "domesticate", "doppler", "drift", "earthquake", "echinoderm", "eclipse", "ecosystem",
  "efficiency", "electromagnetic", "electron", "electrophoresis", "elimination", "elemental", "embryology",
  "emission", "enzyme", "epidemiology", "equator", "erosion", "exponential", "factorial", "farming", "fertilization",
  "fertility", "filament", "fission", "fossil", "fungal", "fusion", "galvanize", "genetic", "geology", "geothermal",
  "glacier", "granite", "gravitational", "habitat", "herbivore", "heredity", "heterogeneous", "homogeneous",
  "hydraulic", "hydrogen", "immunoglobulin", "infectious", "influenza", "inorganic", "ion", "isotope", "kinetic",
  "laboratory", "landslide", "lateral", "latitude", "lava", "leaf", "levitation", "limestone", "lithium", "luminescence",
  "magnesium", "magnify", "magnitude", "mammal", "marsupial", "matter", "meiosis", "mercury", "metabolism",
  "metamorphosis", "meteorology", "methane", "microscopic", "mineral", "mitochondria", "molecule", "momentum",
  "monomer", "morphology", "mutation", "natural", "nebula", "neutron", "niche", "nucleic", "nucleus", "nutrient",
  "observatory", "organic", "organism", "osmosis", "oxidation", "oxygen", "ozone", "pandemic", "parasitic", "particle",
  "petrify", "phenomenon", "photosphere", "phylum", "planetary", "plasma", "platelet", "pollution", "positron",
  "potential", "precipitate", "protein", "psychology", "quarantine", "quark", "radiation", "radio", "rainforest",
  "reactant", "reagent", "recycle", "refraction", "regeneration", "respiratory", "saline", "satellite", "sediment",
  "seismic", "solstice", "species", "spectrum", "sperm", "spinal", "spore", "sterilization", "stratosphere", "subspecies",
  "sunspot", "surface", "symbiosis", "synthesis", "taxonomy", "telescopic", "temperature", "terrestrial", "topography",
  "toxicity", "transistor", "turbine", "ultraviolet", "vascular", "vector", "velocity", "vibration", "virus", "volcano",
  "wavelength", "weather", "xenon", "yield", "yolk", "zoology", "absorption", "acoustics", "adaptation", "airflow",
  "airmass", "alveoli", "amplitude", "angstrom", "antibody", "antigen", "antiseptic", "anvil", "arc", "archaeology",
  "artery", "ash", "asterism", "atmosphere", "atom", "bacteriophage", "bar", "baseline", "beaker", "behavior",
  "bell", "bioinformatics", "biome", "bipolar", "bit", "biogeography", "biophysics", "botanical", "cadmium",
  "calorie", "capillary", "capsid", "carbonyl", "carotenoid", "cartilage", "catalysis", "catheter", "cellular",
  "cephalopod", "charge", "chloride", "chordate", "chromatography", "cloning", "cognitive", "colloid", "commensal",
  "congenital", "conservation", "continental", "crust", "cybernetics", "dendrology", "density", "detonation",
  "dialysis", "dielectric", "diffraction", "digital", "diode", "distill", "dopamine", "double", "ecological",
  "ejection", "elasticity", "electrolysis", "endocrine", "energy", "epigenetics", "erosion", "ethology", "evaporation",
  "evolution", "exponential", "exposure", "fermentation", "field", "filament", "filter", "fireball", "fission",
  "flora", "folding", "frequency", "fusion", "genetics", "genome", "geochemistry", "glucose", "granite", "greenhouse",
  "hematology", "hemisphere", "herbaceous", "hertz", "hydrosphere", "ionize", "ions", "iron", "isotonic", "joule",
  "kelvin", "keystone", "latitude", "lignite", "liquid", "magma", "magnesium", "magnet", "mars", "melanin",
  "membrane", "mendelevium", "metabolism", "metamorphic", "methane", "microscope", "mitosis", "mole", "momentum",
  "mutation", "natural", "nerve", "neutron", "noble", "node", "nucleus", "nutrient", "oceanography", "optics",
  "osmosis", "oxidant", "oxygen", "parasitology", "particle", "period", "phosphorus", "physiology", "pollination",
  "polymer", "potassium", "pyramid", "pyrite", "radar", "radiocarbon", "radiology", "radiowave", "recycling",
  "respiration", "seismology", "sequence", "silica", "sodium", "soil", "species", "spectrograph", "subduction",
  "sulfur", "sustainable", "synthesis", "tectonics", "temperature", "thrombosis", "transpiration", "trophic",
  "ultrasound", "vertebrate", "virus", "vortex", "wave", "weather", "wavelength", "xylem", "yield", "yolk", "zoological"
];

const today = new Date().getDate();
const start = (today - 1) * 30;
const end = Math.min(start + 30, topics.length);
const dayTopics = topics.slice(start, end);

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "startCustomTimer":
      startCustomAutomation(message.searchCount, message.customTimer);
      break;
    case "startPredefinedTimer":
      startPreDefinedAutomation(message.searchCount);
      break;
    case "startNoTimer":
      startNoTimerAutomation(message.searchCount);
      break;
    case "stopAutomation":
      stopAutomation();
      break;
    case "closeTabs":
      closeAutomation();
      break;
    default:
      console.log("Unknown action:", message.action);
  }
});

// Start automation with a custom timer
function startCustomAutomation(searchCount, timer) {
  clearInterval(searchInterval);
  searchesRemaining = searchCount;

  searchInterval = setInterval(() => {
    if (searchesRemaining <= 0) {
      stopAutomation();
      console.log("Search automation with custom timer is completed successfully.");
    } else {
      performSearch();
      searchesRemaining--;
      console.log(`Searches remaining: ${searchesRemaining}`);
    }
  }, timer);
}

// Start automation with a predefined timer
function startPreDefinedAutomation(searchCount) {
  clearInterval(searchInterval);
  searchesRemaining = searchCount;
  searchesThisCycle = 0;
  initiateSearchCycle();
}

// Initiates a cycle of 3 searches with a 15-second interval
function initiateSearchCycle() {
  if (searchesRemaining <= 0) {
    stopAutomation();
    console.log("Search automation with predefined time is completed successfully.");
    return;
  }

  // Perform 3 searches with 15 seconds interval (15 seconds per search)
  for (let i = 0; i < maxSearchesPerCycle; i++) {
    setTimeout(() => {
      if (searchesRemaining > 0) {
        performSearch();
        searchesRemaining--;
        searchesThisCycle++;
      }
      console.log(`Searches remaining: ${searchesRemaining}`);
    }, i * 15000); // 15 seconds interval
    console.log(`Search cycle: (${searchesThisCycle}/${maxSearchesPerCycle})`);
  }

  // After completing 3 searches, wait for 15 minutes before starting the next cycle
  setTimeout(() => {
    if (searchesRemaining > 0) {
      initiateSearchCycle();
      console.log("Search cycle completed. Starting the next cycle.");
    }
  }, restPeriod); // Wait for 15 minutes (900000 ms)
}

// Start automation with no timer (open all tabs at once)
function startNoTimerAutomation(searchCount) {
  for (let i = 0; i < searchCount; i++) {
    performSearch();
  }
  console.log("One-time search automation completed successfully.");
}

// Perform a Bing search
function performSearch() {
  const query = generateSearchQuery();
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

  chrome.storage.sync.get("focusTabs", (data) => {
    chrome.tabs.create({ url, active: data.focusTabs || false });
  });
  console.log(`Search performed for: ${query} at ${new Date().toLocaleTimeString()}`);
}

// Generate a search query based on the current date with 930 unique words
function generateSearchQuery() {
  const query = dayTopics[currentIndex];
  currentIndex = (currentIndex + 1) % dayTopics.length;
  return query;
}

// Stop all automation tasks
function stopAutomation() {
  clearInterval(searchInterval);
  searchesRemaining = 0;
  searchesThisCycle = 0;
  console.log("All running tasks are stopped successfully.");
}

// Close all other opened tabs
function closeAutomation() {
  chrome.tabs.query({}, (tabs) => {
    const currentTab = tabs.find((tab) => tab.active);
    if (currentTab) {
      tabs.forEach((tab) => {
        if (tab.id !== currentTab.id) {
          chrome.tabs.remove(tab.id);
        }
      });
      console.log("All other tabs are closed successfully.");
    }
  });
}
