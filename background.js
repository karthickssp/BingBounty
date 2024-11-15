const restPeriod = 900000; // 15 minutes
const maxSearchesPerCycle = 3;
let searchCount = 0;
let searchLimit = 0;
let searchesRemaining = 0;
let currentIndex = 0;
let searchInterval;

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

const today = new Date().toDateString();
const start = Math.max((new Date().getDate() - 1) * 30, 0);
const end = Math.min(start + 30, topics.length);
const dayTopics = topics.slice(start, end);

// Chrome message listener
chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case "startCustomTimer-Desktop":
            startCustomAutomation(message.searchCount, message.customTimer);
            break;
        case "startPredefinedTimer-Desktop":
            startPreDefinedAutomation(message.searchCount);
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
    }
});

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
  chrome.runtime.sendMessage({ action: "incrementsearchCount" });
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
    }
  });
}

async function startPreDefinedAutomation(searchCount) {
    searchesRemaining = searchCount;
    await initiateSearchCycle();
}

async function initiateSearchCycle() {
    while (searchesRemaining > 0) {
        for (let i = 0; i < Math.min(maxSearchesPerCycle, searchesRemaining); i++) {
            performDesktopSearch();
            searchesRemaining--;
            await new Promise(resolve => setTimeout(resolve, 15000)); // 15s
        }
        await new Promise(resolve => setTimeout(resolve, restPeriod)); // 15m
    }
}

function startNoTimerAutomation(searchCount) {
    for (let i = 0; i < searchCount; i++) {
        performDesktopSearch();
    }
}

function performDesktopSearch() {
    const query = generateDesktopSearchQuery();
    chrome.storage.sync.get("focusTabs", (data) => {
        const focusTabs = data.focusTabs || false;
        chrome.tabs.create({ active: focusTabs }, (newTab) => {
            if (!newTab) return;
            chrome.tabs.update(newTab.id, { url: `https://www.bing.com/search?q=${query}` });
        });
    });
    incrementSearchCount();
}

function incrementSearchCount() {
    searchCount++;
    chrome.storage.sync.set({ searchCount });
}

function generateDesktopSearchQuery() {
    const query = desktopTopics[currentIndex];
    currentIndex = (currentIndex + 1) % desktopTopics.length;
    return query;
}

function stopAutomation() {
    clearInterval(searchInterval);
    searchesRemaining = 0;
    currentIndex = 0;
}

function closeAutomation() {
    chrome.tabs.query({}, (tabs) => {
        const currentTab = tabs.find((tab) => tab.active);
        if (currentTab) {
            tabs.forEach((tab) => {
                if (tab.id !== currentTab.id) {
                    chrome.tabs.remove(tab.id);
                }
            });
        }
    });
}
