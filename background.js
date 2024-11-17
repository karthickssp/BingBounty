let searchInterval;
let searchesRemaining = 0;
let currentIndex = 0;
let searchesThisCycle = 0;
const maxSearchesPerCycle = 3;
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
  "wavelength", "weather", "xenon", "yield", "yolk", "zoological", "algorithm", "antibody", "architecture", "asteroid",
  "bacterium", "biodiversity", "biosphere", "blockchain", "calculus", "catalyst", "cellulose", "chromosome", "climate",
  "cognition", "computation", "conifer", "corrosion", "cybersecurity", "data", "database", "decibel", "dendrite", "density",
  "deposition", "ecosystem", "electricity", "enzyme", "evolution", "galaxy", "genome", "geothermal", "gravity", "hemoglobin",
  "hormone", "hydrology", "inertia", "intelligence", "isotope", "kinetics", "lightyear", "molecule", "nanotechnology",
  "nucleus", "optics", "organism", "paleontology", "photosynthesis", "physics", "plasma", "protein", "quantum", "radiation",
  "respiration", "robotics", "satellite", "simulation", "solar", "spectrum", "sustainability", "telescope", "thermal",
  "turbine", "vaccine", "virus", "waveform", "xenon", "zygote", "aerodynamics", "algorithmic", "anatomy", "antioxidant",
  "astrophysics", "atmosphere", "bacteria", "bauxite", "biodegradable", "bionics", "botany", "byte", "carbohydrate",
  "cardiology", "chemical", "circuit", "classical", "cloning", "conduction", "conservation", "crustacean", "cytoplasm",
  "datalogy", "diatomic", "dichotomy", "diffusion", "dinosaur", "dna", "ecology", "economics", "electron", "element",
  "engineering", "entomology", "environment", "ethics", "fiber", "fungi", "fusion", "galileo", "gene", "geography",
  "geophysics", "giant", "gravity", "hemisphere", "hormonal", "hypothesis", "immunology", "innovation", "insulin",
  "invertebrate", "irrigation", "jurassic", "lactose", "lithosphere", "magnetic", "meteor", "microbiology", "microscope",
  "mitosis", "mutation", "natural", "nitrate", "nutrient", "optical", "organ", "osmosis", "pathogen", "pH", "photon",
  "phylum", "physiotherapy", "plankton", "plate", "polymer", "preservation", "propulsion", "proton", "radioactivity",
  "reaction", "refraction", "reproduction", "resistance", "resonance", "seismology", "software", "solution", "species",
  "subatomic", "synergy", "systematic", "taxonomy", "technology", "temperature", "transmission", "ultrasound", "universe",
  "vertebrate", "vibration", "volcanology", "wavelength", "xylem", "yolk", "yield", "zoology", "adrenaline", "affinity",
  "agriculture", "alloy", "alternative", "amino", "anemometer", "annual", "arithmetic", "array", "atmospheric", "barometer",
  "biopsy", "blood", "borealis", "brain", "cancer", "capillary", "carbon", "carnivore", "catastrophe", "cell", "centrifugal",
  "chameleon", "chemical", "chlorophyll", "chromium", "circulation", "climatology", "coagulant", "cognitive", "comet",
  "compass", "compost", "compression", "compound", "conduction", "constellation", "contaminant", "control", "convection",
  "convergent", "cosmic", "cranium", "crystal", "cylinder", "cytoplasmic", "decay", "decibel", "deduction", "density",
  "deoxyribonucleic", "detritus", "diffraction", "disease", "domesticate", "doppler", "drift", "earthquake", "echinoderm",
  "eclipse", "ecosystem", "efficiency", "electromagnetic", "electron", "electrophoresis", "elimination", "elemental",
  "embryology", "emission", "enzyme", "epidemiology", "equator", "erosion", "exponential", "factorial", "farming",
  "fertilization", "fertility", "filament", "fission", "fossil", "fungal", "fusion", "galvanize", "genetic", "geology",
  "geothermal", "glacier", "granite", "gravitational", "habitat", "herbivore", "heredity", "heterogeneous", "homogeneous",
  "hydraulic", "hydrogen", "immunoglobulin", "infectious", "influenza", "inorganic", "ion", "isotope", "kinetic",
  "laboratory", "landslide", "lateral", "latitude", "lava", "leaf", "levitation", "limestone", "lithium", "luminescence",
  "magnesium", "magnify", "magnitude", "mammal", "marsupial", "matter", "meiosis", "mercury", "metabolism", "metamorphosis",
  "meteorology", "methane", "microscopic", "mineral", "mitochondria", "molecule", "momentum", "monomer", "morphology",
  "mutation", "natural", "nebula", "neutron", "niche", "nucleic", "nucleus", "nutrient", "observatory", "organic",
  "organism", "osmosis", "oxidation", "oxygen", "ozone", "pandemic", "parasitic", "particle", "petrify", "phenomenon",
  "photosphere", "phylum", "planetary", "plasma", "platelet", "pollution", "positron", "potential", "precipitate",
  "protein", "psychology", "quarantine", "quark", "radiation", "radio", "rainforest", "reactant", "reagent", "recycle",
  "refraction", "regeneration", "respiratory", "saline", "satellite", "sediment", "seismic", "solstice", "species",
  "spectrum", "sperm", "spinal", "spore", "sterilization", "stratosphere", "subspecies", "sunspot", "surface", "symbiosis",
  "synthesis", "taxonomy", "telescopic", "temperature", "terrestrial", "topography", "toxicity", "transistor", "turbine",
  "ultraviolet", "vascular", "vector", "velocity", "vibration", "virus", "volcano", "wavelength", "weather", "xenon",
  "yield", "yolk", "zoological","algorithm", "antibody", "architecture", "asteroid", "bacterium", "biodiversity", "biosphere", 
  "blockchain", "calculus", "catalyst", "cellulose", "chromosome", "climate", "cognition", "computation", "conifer",
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
  "wavelength", "weather", "xenon", "yield", "yolk", "zoological", "algorithm", "antibody", "architecture", "asteroid",
  "bacterium", "biodiversity", "biosphere", "blockchain", "calculus", "catalyst", "cellulose", "chromosome", "climate",
  "cognition", "computation", "conifer", "corrosion", "cybersecurity", "data", "database", "decibel", "dendrite", "density",
  "deposition", "ecosystem", "electricity", "enzyme", "evolution", "galaxy", "genome", "geothermal", "gravity", "hemoglobin",
  "hormone", "hydrology", "inertia", "intelligence", "isotope", "kinetics", "lightyear", "molecule", "nanotechnology",
  "nucleus", "optics", "organism", "paleontology", "photosynthesis", "physics", "plasma", "protein", "quantum", "radiation",
  "respiration", "robotics", "satellite", "simulation", "solar", "spectrum", "sustainability", "telescope", "thermal",
  "turbine", "vaccine", "virus", "waveform", "xenon", "zygote", "aerodynamics", "algorithmic", "anatomy", "antioxidant",
  "astrophysics", "atmosphere", "bacteria", "bauxite", "biodegradable", "bionics", "botany", "byte", "carbohydrate",
  "cardiology", "chemical", "circuit", "classical", "cloning", "conduction", "conservation", "crustacean", "cytoplasm",
  "datalogy", "diatomic", "dichotomy", "diffusion", "dinosaur", "dna", "ecology", "economics", "electron", "element",
  "engineering", "entomology", "environment", "ethics", "fiber", "fungi", "fusion", "galileo", "gene", "geography",
  "geophysics", "giant", "gravity", "hemisphere", "hormonal", "hypothesis", "immunology", "innovation", "insulin",
  "invertebrate", "irrigation", "jurassic", "lactose", "lithosphere", "magnetic", "meteor", "microbiology", "microscope",
  "mitosis", "mutation", "natural", "nitrate", "nutrient", "optical", "organ", "osmosis", "pathogen", "pH", "photon",
  "phylum", "physiotherapy", "plankton", "plate", "polymer", "preservation", "propulsion", "proton", "radioactivity",
  "reaction", "refraction", "reproduction", "resistance", "resonance", "seismology", "software", "solution", "species",
  "subatomic", "synergy", "systematic", "taxonomy", "technology", "temperature", "transmission", "ultrasound", "universe",
  "vertebrate", "vibration", "volcanology", "wavelength", "xylem", "yolk", "yield", "zoology", "adrenaline", "affinity",
  "agriculture", "alloy", "alternative", "amino", "anemometer", "annual", "arithmetic", "array", "atmospheric", "barometer",
  "biopsy", "blood", "borealis", "brain", "cancer", "capillary", "carbon", "carnivore", "catastrophe", "cell", "centrifugal",
  "chameleon", "chemical", "chlorophyll", "chromium", "circulation", "climatology", "coagulant", "cognitive", "comet",
  "compass", "compost", "compression", "compound", "conduction", "constellation", "contaminant", "control", "convection",
  "convergent", "cosmic", "cranium", "crystal", "cylinder", "cytoplasmic", "decay", "decibel", "deduction", "density",
  "deoxyribonucleic", "detritus", "diffraction", "disease", "domesticate", "doppler", "drift", "earthquake", "echinoderm",
  "eclipse", "ecosystem", "efficiency", "electromagnetic", "electron", "electrophoresis", "elimination", "elemental",
  "embryology", "emission", "enzyme", "epidemiology", "equator", "erosion", "exponential", "factorial", "farming",
  "fertilization", "fertility", "filament", "fission", "fossil", "fungal", "fusion", "galvanize", "genetic", "geology",
  "geothermal", "glacier", "granite", "gravitational", "habitat", "herbivore", "heredity", "heterogeneous", "homogeneous",
  "hydraulic", "hydrogen", "immunoglobulin", "infectious", "influenza", "inorganic", "ion", "isotope", "kinetic",
  "laboratory", "landslide", "lateral", "latitude", "lava", "leaf", "levitation", "limestone", "lithium", "luminescence",
  "magnesium", "magnify", "magnitude", "mammal", "marsupial", "matter", "meiosis", "mercury", "metabolism", "metamorphosis",
  "meteorology", "methane", "microscopic", "mineral", "mitochondria", "molecule", "momentum", "monomer", "morphology",
  "mutation", "natural", "nebula", "neutron", "niche", "nucleic", "nucleus", "nutrient", "observatory", "organic",
  "organism", "osmosis", "oxidation", "oxygen", "ozone", "pandemic", "parasitic", "particle", "petrify", "phenomenon",
  "photosphere", "phylum", "planetary", "plasma", "platelet", "pollution", "positron", "potential", "precipitate",
  "protein", "psychology", "quarantine", "quark", "radiation", "radio", "rainforest", "reactant", "reagent", "recycle",
  "refraction", "regeneration", "respiratory", "saline", "satellite", "sediment", "seismic", "solstice", "species",
  "spectrum", "sperm", "spinal", "spore", "sterilization", "stratosphere", "subspecies", "sunspot", "surface", "symbiosis",
  "synthesis", "taxonomy", "telescopic", "temperature", "terrestrial", "topography", "toxicity", "transistor", "turbine",
  "ultraviolet", "vascular", "vector", "velocity", "vibration", "virus", "volcano", "wavelength", "weather", "xenon",
  "yield", "yolk", "zoological"
];
console.log(`Total topics: ${topics.length}`);

const today = new Date().getDate();
const start = (today - 1) * 50;
const end = Math.min(start + 50, topics.length);
const desktopTopics = topics.slice(start, end-20);
const mobileTopics = topics.slice(end-20, end);
console.log(`Desktop topics: ${desktopTopics.length}`);
console.log(desktopTopics);
console.log(`Mobile topics: ${mobileTopics.length}`);
console.log(mobileTopics);


// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "startCustomTimer-Mobile":
      MobileCustomAutomation(message.searchCount, message.customTimer);
      break;
    case "startCustomTimer-Desktop":
      startCustomAutomation(message.searchCount, message.customTimer);
      break;
    case "startPredefinedTimer-Mobile":
      MobilePreDefinedAutomation(message.searchCount);
      break;
    case "startPredefinedTimer-Desktop":
      startPreDefinedAutomation(message.searchCount);
      break;
    case "startNoTimer-Mobile":
      MobileNoTimerAutomation(message.searchCount);
      break;
    case "startNoTimer-Desktop":
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

// wait for the extension to initialize before executing any actions
chrome.runtime.onStartup.addListener(() => {
  setTimeout(() => {
    performMobileSearch();
  }, 5000); // Delay by 5 second
});


// Start Mobile automation with a predefined timer
function MobileCustomAutomation(searchCount, timer) {
  clearInterval(searchInterval);
  searchesRemaining = searchCount;
  searchInterval = setInterval(() => {
    if (searchesRemaining <= 0) {
      stopAutomation();
      console.log("Mobile search automation with custom timer is completed successfully.");
    } else {
      performMobileSearch();
      searchesRemaining--;
      console.log(`Searches remaining: ${searchesRemaining}`);
    }
  }, timer);
}

// Start Desktop automation with a custom timer
function startCustomAutomation(searchCount, timer) {
  clearInterval(searchInterval);
  searchesRemaining = searchCount;
  
  searchInterval = setInterval(() => {
    if (searchesRemaining <= 0) {
      stopAutomation();
      console.log("Desktop search automation with custom timer is completed successfully.");
    } else {
      performDesktopSearch();
      searchesRemaining--;
      console.log(`Searches remaining: ${searchesRemaining}`);
    }
  }, timer);
}

// Start Mobile automation with a predefined timer
function MobilePreDefinedAutomation(searchCount) {
  clearInterval(searchInterval);
  searchesRemaining = searchCount;
  searchesThisCycle = 0;
  initiateMobileSearchCycle();
}

// Start Desktop automation with a predefined timer
function startPreDefinedAutomation(searchCount) {
  clearInterval(searchInterval);
  searchesRemaining = searchCount;
  searchesThisCycle = 0;
  initiateSearchCycle();
}

// Initiates a cycle of 3 searches with a 15-second interval for Mobile
function initiateMobileSearchCycle() {
  if(searchesRemaining <= 0) {
    stopAutomation();
    console.log("Mobile search automation with predefined time is completed successfully.");
    return;
  }

  for (let i = 0; i < maxSearchesPerCycle; i++) {
    setTimeout(() => {
      if (searchesRemaining > 0) {
        performMobileSearch();
        searchesRemaining--;
        searchesThisCycle++;
      }
      console.log(`Searches remaining: ${searchesRemaining}`);
    }, i * 15000); // 15 seconds interval
    console.log(`Search cycle: (${searchesThisCycle}/${maxSearchesPerCycle})`);
  }

  setTimeout(() => {
    if (searchesRemaining > 0) {
      initiateMobileSearchCycle();
      console.log("Search cycle completed. Starting the next cycle.");
    }
  }, restPeriod); // Wait for 15 minutes (900000 ms)
}

// Initiates a cycle of 3 searches with a 15-second interval for Desktop
function initiateSearchCycle() {
  if (searchesRemaining <= 0) {
    stopAutomation();
    console.log("Desktop search automation with predefined time is completed successfully.");
    return;
  }

  // Perform 3 searches with 15 seconds interval (15 seconds per search)
  for (let i = 0; i < maxSearchesPerCycle; i++) {
    setTimeout(() => {
      if (searchesRemaining > 0) {
        performDesktopSearch();
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

// Start automation with no timer (open all tabs at once) for Mobile
function MobileNoTimerAutomation(searchCount) {
  alert("Mobile automation with no timer is not supported.");
  console.log("One-time search automation not possible.");
  stopAutomation();
}

// Start automation with no timer (open all tabs at once) for Desktop
function startNoTimerAutomation(searchCount) {
  for (let i = 0; i < searchCount; i++) {
    performDesktopSearch();
  }
  console.log("One-time search automation completed successfully.");
}

// wait for the extension to initialize before executing any actions
function performMobileSearch(){
  setTimeout(() =>{
    startMobileSearch();
  },5000);
}


//perform a mobile search
function startMobileSearch() {
  const query = generateMobileSearchQuery();
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const currentTabId = tabs[0].id;
      chrome.tabs.update(currentTabId, { url }, () => {
        chrome.runtime.sendMessage({ action: "incrementsearchCount" });
        console.log(`Search performed for: ${query} at ${new Date().toLocaleTimeString()}`);
      });
    } else {
      console.error("No active tab found.");
    }
  });
}

// Perform a Bing search
function performDesktopSearch() {
  const query = generateDesktopSearchQuery();
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

  chrome.storage.sync.get("focusTabs", (data) => {
    chrome.tabs.create({ url, active: data.focusTabs || false });
  });
  console.log(`Search performed for: ${query} at ${new Date().toLocaleTimeString()}`);
}

// Generate a search query based on the current date with 930 unique words for Desktop
function generateDesktopSearchQuery() {
  const query = desktopTopics[currentIndex];
  currentIndex = (currentIndex + 1) % desktopTopics.length;
  return query;
}

// Generate a search query based on the current date with 930 unique words for Mobile
function generateMobileSearchQuery() {
  const query = mobileTopics[currentIndex];
  currentIndex = (currentIndex + 1) % mobileTopics.length;
  return query;
}

// Stop all automation tasks
function stopAutomation() {
  clearInterval(searchInterval);
  searchesRemaining = 0;
  searchesThisCycle = 0;
  currentIndex = 0;
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
