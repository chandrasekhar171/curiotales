
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface CurioStory {
  id: string;
  title: string;
  content: string;
  category: string;
  ageRange: string;
  icon?: string;
}

const categories = [
  { name: 'Science', icon: '🧪' },
  { name: 'History', icon: '🏺' },
  { name: 'Technology', icon: '💻' },
  { name: 'Nature', icon: '🌿' },
  { name: 'Space', icon: '🚀' },
  { name: 'Arts', icon: '🎨' },
  { name: 'Culture', icon: '🌍' },
  { name: 'Random', icon: '🎲' }
];

const ageRanges = [
  { name: '1-3 years', icon: '👶' },
  { name: '3-5 years', icon: '🧒' },
  { name: '5-7 years', icon: '👦' },
  { name: '7-9 years', icon: '👧' },
  { name: '9-12 years', icon: '🧑' },
  { name: '12-14 years', icon: '👨' }
];

export default function CurioTales() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState('');
  const [stories, setStories] = useState<CurioStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStory, setSelectedStory] = useState<CurioStory | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStoriesPage, setShowStoriesPage] = useState(false);

  const generateAgeAppropriateContent = (topic: string, category: string, ageRange: string): CurioStory[] => {
    // Generate a single random story based on the topic or category
    const getStoryForTopic = (searchTopic: string, cat: string) => {
      if (searchTopic) {
        // For search-based topics, create a story about that specific topic
        return {
          title: `The Amazing World of ${searchTopic}`,
          baseContent: searchTopic.toLowerCase(),
          type: 'search'
        };
      }

      // For category-based stories, pick one random story from that category
      const categoryStories = {
        'science': [
          { title: 'Amazing Bananas', baseContent: 'bananas are berries but strawberries are not', type: 'bananas' },
          { title: 'Honey Magic', baseContent: 'honey never spoils and was found in ancient tombs', type: 'honey' },
          { title: 'Water Memory', baseContent: 'water has three states and expands when frozen', type: 'water' },
          { title: 'Lightning Speed', baseContent: 'lightning is hotter than the surface of the sun', type: 'lightning' }
        ],
        'history': [
          { title: 'Library Magic', baseContent: 'ancient library copied all books from ships', type: 'library' },
          { title: 'Cleopatra Time', baseContent: 'Cleopatra lived closer to moon landing than pyramid building', type: 'cleopatra' },
          { title: 'Viking Reach', baseContent: 'Vikings reached America 500 years before Columbus', type: 'vikings' },
          { title: 'Great Wall Myth', baseContent: 'Great Wall of China is not visible from space', type: 'wall' }
        ],
        'nature': [
          { title: 'Shark Friends', baseContent: 'sharks lived before trees existed on Earth', type: 'sharks' },
          { title: 'Octopus Dreams', baseContent: 'octopuses can dream and change colors while sleeping', type: 'octopus' },
          { title: 'Wombat Cubes', baseContent: 'wombats make cube-shaped poop', type: 'wombats' },
          { title: 'Elephant Memory', baseContent: 'elephants can recognize themselves in mirrors', type: 'elephants' }
        ],
        'space': [
          { title: 'Space Silence', baseContent: 'space is completely silent because there is no air', type: 'silence' },
          { title: 'Venus Heat', baseContent: 'Venus is hotter than Mercury despite being further from sun', type: 'venus' },
          { title: 'Neutron Star', baseContent: 'a neutron star spoonful would weigh as much as Mount Everest', type: 'neutron' },
          { title: 'Solar System Speed', baseContent: 'our solar system is moving through space at 828,000 km/h', type: 'speed' }
        ],
        'technology': [
          { title: 'Computer Bug', baseContent: 'first computer bug was an actual bug stuck in a machine', type: 'bug' },
          { title: 'Internet Weight', baseContent: 'the entire internet weighs about the same as a strawberry', type: 'internet' },
          { title: 'Email History', baseContent: 'email was invented before the World Wide Web', type: 'email' },
          { title: 'Phone Power', baseContent: 'modern smartphones are more powerful than 1969 NASA computers', type: 'phone' }
        ],
        'arts': [
          { title: 'Mona Lisa Size', baseContent: 'Mona Lisa is only 30 inches tall and 21 inches wide', type: 'mona' },
          { title: 'Color Blue', baseContent: 'blue pigment was once more valuable than gold', type: 'blue' },
          { title: 'Music Math', baseContent: 'music and mathematics are closely related through patterns', type: 'music' },
          { title: 'Theater Masks', baseContent: 'theater masks represent comedy and tragedy from ancient Greece', type: 'theater' }
        ],
        'culture': [
          { title: 'Fortune Cookies', baseContent: 'fortune cookies were actually invented in America, not China', type: 'cookies' },
          { title: 'High Five', baseContent: 'the high five was invented in 1977 by baseball players', type: 'highfive' },
          { title: 'Sandwich Name', baseContent: 'sandwich is named after the Earl of Sandwich who ate while playing cards', type: 'sandwich' },
          { title: 'Pizza History', baseContent: 'pizza was originally considered peasant food in Italy', type: 'pizza' }
        ]
      };

      const stories = categoryStories[cat.toLowerCase()] || [
        { title: 'Amazing Butterflies', baseContent: 'butterflies taste with their feet', type: 'butterflies' },
        { title: 'Flamingo Groups', baseContent: 'a group of flamingos is called a flamboyance', type: 'flamingos' },
        { title: 'Rubber Bands', baseContent: 'rubber bands last longer when refrigerated', type: 'rubber' },
        { title: 'Shrimp Hearts', baseContent: 'a shrimp heart is in its head', type: 'shrimp' }
      ];

      // Pick a random story from the category
      return stories[Math.floor(Math.random() * stories.length)];
    };

    const selectedStory = getStoryForTopic(topic, category || 'random');
    let content = '';

    // Generate age-appropriate content based on the story type and age range
    switch (ageRange) {
      case '1-3 years':
        switch (selectedStory.type) {
          case 'silence':
            content = 'Space is very quiet! Shh! No sounds at all! Why? No air in space! Whoosh! Air helps sounds travel. But space has no air! So astronauts can\'t hear sounds. They use special radios! Beep beep! Cool, right?';
            break;
          case 'venus':
            content = 'Venus is hot! Very, very hot! Hotter than the Sun\'s friend Mercury! Why? Venus has thick clouds! Like a big blanket! The blanket keeps heat inside. So Venus gets super hot! Sizzle!';
            break;
          case 'neutron':
            content = 'Some stars are super heavy! One tiny spoon would be like a big mountain! Wow! These stars are called neutron stars. They\'re very small but very, very heavy! Amazing!';
            break;
          case 'speed':
            content = 'Our Earth goes zoom zoom through space! Very fast! Like the fastest car ever! We can\'t feel it moving. But we\'re flying through space right now! Wheee!';
            break;
          case 'search':
            content = `${topic} is amazing! There are so many cool things about ${topic}! Pop! Bang! ${topic} can surprise you! Let\'s learn more about ${topic} together! Fun fun!`;
            break;
          default:
            content = 'This is something super cool! It can surprise you in amazing ways! There are fun facts that will make you go "Wow!" Let\'s discover together!';
        }
        break;

      case '3-5 years':
        switch (selectedStory.type) {
          case 'silence':
            content = 'Did you know space is completely silent? That means there are no sounds at all! On Earth, we hear sounds because they travel through air. But space doesn\'t have any air! So if an astronaut tried to shout in space, no one could hear them. That\'s why astronauts use special radios to talk to each other. Space is like the quietest place ever!';
            break;
          case 'venus':
            content = 'Here\'s something surprising about our neighbor planet Venus - it\'s actually hotter than Mercury, even though Mercury is closer to the Sun! Why do you think this happens? Venus has very thick clouds made of dangerous gases that trap heat like a super-thick blanket. These clouds keep all the Sun\'s heat inside, making Venus the hottest planet in our solar system. It\'s so hot that metal would melt there!';
            break;
          case 'neutron':
            content = 'Imagine a star so heavy that just one tiny spoonful would weigh as much as a huge mountain like Mount Everest! These special stars are called neutron stars. They\'re really, really small - about the size of a city - but they\'re incredibly heavy. If you could somehow put a neutron star on a scale, it would be heavier than our entire Sun! Scientists think they\'re made of the smallest pieces of matter all squished together.';
            break;
          case 'speed':
            content = 'Right now, as you\'re sitting and reading this, you\'re actually traveling through space super fast! Our whole solar system - that\'s our Sun, Earth, and all the other planets - is zooming through space at 828,000 kilometers per hour! That\'s faster than any rocket or airplane ever built. We can\'t feel it because everything around us is moving at the same speed. It\'s like being in a car - you don\'t feel like you\'re moving when you look at the other people in the car with you!';
            break;
          case 'search':
            content = `${topic} is full of amazing surprises! There are so many fascinating things to discover about ${topic}. Scientists and explorers have found incredible facts that might surprise you. ${topic} has special properties and interesting stories that make it unique. Let\'s explore what makes ${topic} so special and wonderful!`;
            break;
          default:
            content = 'This topic is full of wonderful surprises! There are amazing facts that scientists have discovered. It has special properties that make it unique and interesting. Learning about it can help us understand our world better!';
        }
        break;

      case '5-7 years':
        switch (selectedStory.type) {
          case 'silence':
            content = 'Space is the ultimate silent zone! Unlike Earth, where sounds travel through air molecules, space is a vacuum - meaning it\'s completely empty of air or any other matter. Sound waves need something to travel through, like air or water. Without these molecules to carry the vibrations, there\'s no way for sound to exist in space. This means if two spaceships crashed into each other, you wouldn\'t hear any noise at all! Astronauts must rely on radio waves, which can travel through the vacuum of space, to communicate with each other and with Earth.';
            break;
          case 'venus':
            content = 'Venus presents one of the solar system\'s most interesting temperature mysteries. Even though Mercury orbits much closer to the Sun, Venus is actually the hottest planet in our solar system! The secret lies in Venus\'s atmosphere, which is incredibly thick and made mostly of carbon dioxide. This creates what scientists call a "runaway greenhouse effect." The thick atmosphere traps heat from the Sun like a super-insulated blanket, causing surface temperatures to reach about 467°C (872°F) - hot enough to melt lead! Meanwhile, Mercury, despite being closer to the Sun, has almost no atmosphere to trap heat, so it actually gets quite cold at night.';
            break;
          case 'neutron':
            content = 'Neutron stars are among the most extreme objects in the universe, representing what happens when massive stars collapse. When a star much bigger than our Sun runs out of fuel, it explodes in a supernova, then collapses into an incredibly dense object called a neutron star. These stars are so dense that just one teaspoon of neutron star material would weigh about 6 billion tons - equivalent to Mount Everest! They\'re typically only about 20 kilometers across (smaller than most cities), but they contain more mass than our entire Sun. The gravity on a neutron star is so strong that if you could somehow stand on its surface, you would weigh billions of times more than you do on Earth!';
            break;
          case 'speed':
            content = 'While you\'re reading this, you\'re actually racing through space at an incredible speed! Our entire solar system is traveling through the Milky Way galaxy at approximately 828,000 kilometers per hour (about 230 kilometers per second). That\'s fast enough to travel from New York to Los Angeles in just 20 seconds! We don\'t feel this motion because everything around us - Earth, the Moon, the Sun, and all the planets - is moving together at the same speed. It\'s similar to how you don\'t feel like you\'re moving when you\'re in a car traveling at steady speed on a smooth highway. This cosmic journey means that Earth never returns to exactly the same spot in space - we\'re always exploring new regions of our galaxy!';
            break;
          case 'search':
            content = `${topic} is a fascinating subject with many surprising aspects that scientists continue to study and discover. Research has revealed incredible facts about ${topic} that challenge our understanding and spark curiosity. From its basic properties to its complex interactions with the world around us, ${topic} demonstrates the amazing complexity and wonder of our universe. The more we learn about ${topic}, the more questions arise, leading to exciting new discoveries and innovations that help us understand our world better.`;
            break;
          default:
            content = 'This fascinating topic contains many surprising elements that scientists have been studying for years. Research has revealed incredible facts that challenge our understanding and spark curiosity. The more we learn about it, the more amazing it becomes, showing us the wonderful complexity of our world.';
        }
        break;

      case '7-9 years':
        switch (selectedStory.type) {
          case 'silence':
            content = 'Space represents the ultimate acoustic void, where the fundamental physics of sound transmission cannot operate. On Earth, sound travels as vibrations through air molecules - when you speak, your vocal cords create pressure waves that move through the atmosphere at about 343 meters per second. However, space is a near-perfect vacuum, containing less than one atom per cubic centimeter compared to Earth\'s atmosphere, which contains about 25 quintillion molecules in the same space. Without sufficient matter to carry these mechanical waves, sound simply cannot exist in space. This creates fascinating implications for space exploration: spacecraft explosions that would create deafening noise on Earth occur in complete silence. Astronauts must rely on electromagnetic radiation (radio waves) for communication, since these waves don\'t require a medium to travel through. Interestingly, some regions of space do contain enough gas and dust to potentially carry very low-frequency sound waves, but these would be far too faint for human ears to detect.';
            break;
          case 'venus':
            content = 'Venus demonstrates one of the most extreme examples of the greenhouse effect in our solar system, making it hotter than Mercury despite being nearly twice as far from the Sun. Venus\'s atmosphere is about 90 times thicker than Earth\'s and consists of 96% carbon dioxide, with clouds made of sulfuric acid. This creates a runaway greenhouse effect where incoming solar radiation gets trapped and continuously recycled. Surface temperatures reach approximately 467°C (872°F) - hot enough to melt zinc and lead. The atmospheric pressure on Venus is equivalent to being 900 meters underwater on Earth! Meanwhile, Mercury experiences wild temperature swings because it lacks a substantial atmosphere: daytime temperatures reach 427°C (800°F), but nighttime temperatures plummet to -173°C (-280°F). Venus\'s thick atmosphere acts like a planetary thermostat, maintaining consistent scorching temperatures across its entire surface, day and night. Scientists study Venus to better understand how greenhouse gases can affect planetary climates, providing important insights for Earth\'s climate science.';
            break;
          case 'neutron':
            content = 'Neutron stars represent some of the most extreme physics laboratories in the universe, formed when massive stars (at least 8-25 times the mass of our Sun) undergo core collapse during supernova explosions. During this catastrophic event, protons and electrons are literally crushed together to form neutrons, creating matter so dense that a sugar-cube-sized piece would weigh about 100 million tons. A typical neutron star packs 1.4 times the mass of our Sun into a sphere only 20 kilometers in diameter - imagine squeezing all of Manhattan into a space smaller than a marble! The surface gravity is about 200 billion times stronger than Earth\'s, meaning that if you could somehow drop a marshmallow from just one meter above the surface, it would hit the ground at 7.2 million kilometers per hour. Neutron stars also spin incredibly fast (up to 700 times per second) and have magnetic fields trillions of times stronger than Earth\'s. Some neutron stars, called pulsars, emit beams of radiation that sweep across space like cosmic lighthouses, allowing astronomers to study these remarkable objects from thousands of light-years away.';
            break;
          case 'speed':
            content = 'Our cosmic address is constantly changing as we participate in multiple simultaneous motions through space at mind-boggling speeds. While Earth rotates on its axis at about 1,674 km/h at the equator and orbits the Sun at 107,000 km/h, our entire solar system is simultaneously racing through the Milky Way galaxy at approximately 828,000 km/h (230 km/s) toward the constellation Cygnus. This galactic motion means that in the time it takes you to read this sentence, we\'ve traveled about 1,000 kilometers through space! But the motion doesn\'t stop there - our Milky Way galaxy is moving toward the Andromeda galaxy at about 250,000 km/h, and our Local Group of galaxies is being pulled toward an enormous gravitational anomaly called the Great Attractor at roughly 2 million km/h. We don\'t feel these tremendous speeds because of the principle of inertia - everything around us (atmosphere, oceans, buildings) moves together at the same velocity. It\'s similar to how passengers in a smoothly cruising airplane don\'t feel like they\'re moving at 900 km/h. This means that despite feeling stationary, you\'re actually one of the fastest-moving objects you know, constantly exploring uncharted regions of the universe!';
            break;
          case 'search':
            content = `${topic} represents a complex and fascinating area of study that demonstrates the intricate connections between different aspects of our natural world. Scientific research has uncovered remarkable properties and behaviors related to ${topic} that continue to surprise researchers and expand our understanding. These discoveries often reveal unexpected relationships between ${topic} and other phenomena, showing how interconnected our universe really is. The study of ${topic} has led to practical applications and innovations that benefit society, while also raising new questions that drive further scientific investigation. Understanding ${topic} helps us appreciate both the complexity and elegance of the natural processes that shape our world, demonstrating how scientific curiosity leads to knowledge that can improve our lives and expand our perspective on the universe around us.`;
            break;
          default:
            content = 'This subject represents a fascinating area where scientific research continues to uncover remarkable properties and behaviors that surprise researchers. These discoveries reveal unexpected connections and relationships, showing how interconnected our natural world really is, and leading to practical innovations that benefit society.';
        }
        break;

      case '9-12 years':
        switch (selectedStory.type) {
          case 'silence':
            content = 'The acoustic properties of space reveal fundamental principles about wave propagation and the nature of matter distribution throughout the cosmos. Sound, as a mechanical longitudinal wave, requires a medium of sufficient density to facilitate the compression and rarefaction cycles that constitute acoustic transmission. Earth\'s atmosphere, with approximately 2.5 × 10^19 molecules per cubic centimeter at sea level, provides an ideal medium for sound propagation at velocities determined by the medium\'s density, temperature, and elastic properties. Space, however, maintains an average particle density of fewer than one atom per cubic centimeter, creating what physicists classify as an ultra-high vacuum. This sparse distribution of matter makes mechanical wave transmission impossible across cosmic distances. Interestingly, certain regions of space, particularly within nebulae and stellar atmospheres, contain sufficient gas densities to theoretically support very low-frequency acoustic waves, though these would be imperceptible to human auditory systems. The implications extend beyond simple sound transmission - this principle affects how spacecraft are designed for communication systems, requiring electromagnetic radiation rather than acoustic signals for space-based operations. Recent research has even detected "sound waves" in galaxy clusters, where hot gas provides enough medium for pressure waves to propagate across millions of light-years, though these occur at frequencies far below human hearing range and require specialized detection equipment to observe.';
            break;
          case 'venus':
            content = 'Venus exemplifies the catastrophic potential of uncontrolled greenhouse effects, serving as a crucial case study for understanding atmospheric physics and planetary climate systems. Despite receiving only 25% of the solar irradiance that Mercury experiences, Venus maintains surface temperatures of 467°C (872°F) due to its extraordinarily dense atmosphere comprised of 96.5% carbon dioxide, 3.5% nitrogen, and trace amounts of sulfur dioxide, water vapor, and carbon monoxide. The atmospheric pressure reaches 9.2 MPa (approximately 90 Earth atmospheres), equivalent to the pressure experienced 900 meters below Earth\'s ocean surface. This creates a supercritical greenhouse effect where incoming solar radiation becomes trapped within multiple atmospheric layers, with sulfuric acid clouds at altitudes of 48-70 kilometers providing additional insulation. The planet\'s retrograde rotation (opposite to most planets) and extremely slow rotational period of 243 Earth days contribute to uniform heat distribution, eliminating temperature variations between day and night sides. Atmospheric circulation patterns, driven by the extreme temperature differential between surface and upper atmosphere, create wind speeds exceeding 100 m/s at cloud level while surface winds remain relatively calm. Venus\'s atmospheric evolution likely involved a runaway greenhouse process where increasing temperatures caused ocean evaporation, water vapor amplification of the greenhouse effect, and eventual photodissociation of water molecules, with hydrogen escaping to space and oxygen combining with surface rocks. This planetary transformation provides critical insights for Earth\'s climate science, particularly regarding tipping points in atmospheric systems and the long-term consequences of greenhouse gas accumulation.';
            break;
          case 'neutron':
            content = 'Neutron stars represent the most extreme manifestation of matter organization within the observable universe, formed through the gravitational collapse of stellar cores during Type II supernova events when massive stars (typically 8-25 solar masses) exhaust their nuclear fuel supply. The collapse process involves core densities reaching the Chandrasekhar limit, causing electron degeneracy pressure to fail and resulting in the combination of protons and electrons into neutrons through inverse beta decay. This creates objects with densities exceeding 3.7 × 10^17 kg/m³ - approximately 200 trillion times denser than water and approaching nuclear density levels. A typical neutron star contains 1.4 solar masses compressed into a sphere roughly 20 kilometers in diameter, creating surface gravitational fields 2 × 10^11 times stronger than Earth\'s. The extreme physics involved produces several remarkable phenomena: rapid rotation periods (ranging from milliseconds to seconds) due to conservation of angular momentum during collapse, magnetic field strengths reaching 10^8 to 10^15 times Earth\'s magnetic field, and surface temperatures exceeding 10^6 Kelvin. Neutron star matter exists in states impossible to replicate on Earth, with outer crusts of atomic nuclei in crystalline lattices, inner crusts containing neutron-rich nuclei and superfluid neutrons, and cores that may contain exotic matter including hyperons, kaons, or even strange quark matter. Some neutron stars, classified as pulsars, emit highly collimated beams of electromagnetic radiation that sweep across space as the star rotates, providing precise cosmic timekeepers that have enabled tests of general relativity and the detection of gravitational waves. These objects serve as natural laboratories for studying matter under conditions of extreme density, gravity, and magnetic field strength that cannot be achieved through terrestrial experiments.';
            break;
          case 'speed':
            content = 'Our position within the cosmic hierarchy involves participation in multiple simultaneous reference frames, each contributing to our total velocity through space in ways that demonstrate fundamental principles of celestial mechanics and relativistic physics. Earth\'s equatorial rotational velocity of 1,674 km/h results from our planet\'s 23.93-hour rotational period and 40,075-kilometer circumference, creating the familiar day-night cycle while contributing to the Coriolis effect that influences weather patterns and ocean currents. Our orbital motion around the Sun proceeds at 29.78 km/s (107,208 km/h) in an elliptical path with an average radius of 149.6 million kilometers, completing each orbit in 365.25 days while maintaining orbital stability through gravitational force balance. However, the Solar System itself participates in galactic rotation, traveling at approximately 230 km/s (828,000 km/h) around the Milky Way\'s galactic center, completing one galactic year approximately every 225-250 million Earth years. This galactic motion follows a complex path influenced by the gravitational effects of the galaxy\'s spiral arm structure, central supermassive black hole, and dark matter distribution. Additionally, our Local Group of galaxies (including the Milky Way, Andromeda, and smaller satellite galaxies) moves at roughly 600 km/s toward the Virgo Cluster as part of larger-scale cosmic expansion and gravitational attraction. The cosmic microwave background radiation provides a universal reference frame showing that our Local Group moves at approximately 627 km/s relative to the cosmic rest frame. These nested motions illustrate how astronomical objects exist within multiple gravitational systems simultaneously, with each level of organization contributing to our total cosmic velocity. Despite these enormous speeds, we experience no sensation of motion due to Einstein\'s principle of equivalence and the fact that all objects in our immediate environment share the same reference frame, making these cosmic journeys imperceptible to our everyday experience while constantly carrying us through previously unexplored regions of space-time.';
            break;
          case 'search':
            content = `The study of ${topic} encompasses multiple interconnected scientific disciplines and reveals complex relationships that demonstrate the fundamental interconnectedness of natural phenomena. Research in this field employs sophisticated methodologies including experimental observation, mathematical modeling, and theoretical analysis to understand the underlying mechanisms that govern ${topic}\'s behavior and properties. These investigations have revealed intricate cause-and-effect relationships that extend far beyond initial observations, showing how ${topic} influences and is influenced by various environmental, chemical, biological, or physical factors depending on its nature. The practical applications derived from ${topic} research have led to technological innovations, medical advances, environmental solutions, or industrial improvements that benefit society while simultaneously opening new avenues for scientific inquiry. Current research trends focus on understanding the molecular, cellular, or systemic levels of ${topic}\'s operation, utilizing advanced instrumentation and computational analysis to probe deeper into its mechanisms. These studies often reveal unexpected connections between ${topic} and other scientific phenomena, contributing to our broader understanding of natural laws and processes. The interdisciplinary nature of ${topic} research demonstrates how modern science benefits from collaboration between different fields, as insights from physics, chemistry, biology, mathematics, and engineering combine to provide comprehensive understanding. Future research directions in ${topic} promise to address important questions about sustainability, efficiency, optimization, or fundamental principles that could reshape our understanding of the natural world and lead to breakthrough discoveries with global significance.`;
            break;
          default:
            content = 'This fascinating area of study demonstrates the complex interconnections within natural systems and reveals how scientific research employs sophisticated methodologies to understand underlying mechanisms. These investigations show intricate relationships that extend beyond initial observations, leading to practical applications and technological innovations that benefit society.';
        }
        break;

      case '12-14 years':
        switch (selectedStory.type) {
          case 'silence':
            content = 'The acoustic environment of space provides a compelling demonstration of fundamental wave mechanics and the relationship between matter distribution and energy transmission throughout the cosmos. Sound propagation requires a medium capable of supporting mechanical wave transmission through sequential compression and rarefaction cycles, with wave velocity determined by the medium\'s bulk modulus, density, and thermodynamic properties according to the relationship v = √(K/ρ), where K represents bulk modulus and ρ represents density. Earth\'s atmospheric environment, maintaining particle densities of approximately 2.5 × 10^19 molecules per cubic centimeter at standard temperature and pressure, provides optimal conditions for acoustic transmission across frequencies spanning the human auditory range (20 Hz to 20 kHz) and beyond. Interplanetary space, however, exhibits particle densities typically below 10^6 particles per cubic meter, creating what physicists classify as an ultra-high vacuum environment where the mean free path between particle collisions exceeds typical astronomical distances. This sparse matter distribution renders conventional acoustic transmission impossible, as insufficient particles exist to maintain the coherent pressure wave propagation required for sound transmission. Nevertheless, certain cosmic environments do support modified forms of acoustic phenomena: solar wind interactions with planetary magnetospheres generate plasma waves that exhibit acoustic-like properties, interstellar medium regions within nebulae and stellar formation zones contain sufficient gas densities (10^2 to 10^6 particles per cubic centimeter) to support very low-frequency pressure waves, and galaxy cluster environments have enabled the detection of acoustic oscillations propagating through hot intracluster gas across megaparsec distances. These cosmic "sound waves" operate at frequencies far below human perception (periods measured in millions of years) and require specialized radio astronomy techniques for detection. The engineering implications of space\'s acoustic properties significantly influence spacecraft design, necessitating electromagnetic communication systems rather than acoustic alternatives, vibration isolation systems to prevent structural damage from mechanical oscillations, and specialized materials testing since conventional acoustic non-destructive testing methods cannot function in vacuum environments. Recent advances in gravitational wave astronomy have revealed another form of "cosmic sound" - spacetime distortions that propagate at light speed and can be detected by instruments like LIGO, representing the universe\'s most fundamental acoustic medium where space itself serves as the wave-carrying substrate.';
            break;
          case 'venus':
            content = 'Venus exemplifies the catastrophic potential of atmospheric feedback mechanisms and serves as a crucial natural laboratory for understanding planetary climate evolution, greenhouse effect dynamics, and the delicate balance required for maintaining habitable conditions. Despite receiving only 25% of the solar flux density experienced by Mercury (approximately 2,600 W/m² versus 9,100 W/m²), Venus maintains surface temperatures of 737 K (464°C) through an extreme manifestation of the greenhouse effect involving multiple atmospheric feedback loops and radiative transfer processes. The planet\'s dense atmosphere exerts surface pressures of 9.2 MPa (approximately 92 Earth atmospheres), creating conditions equivalent to depths of 910 meters beneath Earth\'s oceans, while maintaining a composition of 96.5% carbon dioxide, 3.5% nitrogen, and trace concentrations of sulfur dioxide, water vapor, carbon monoxide, and noble gases. Sulfuric acid cloud layers extending from 48 to 70 kilometers altitude contribute additional radiative forcing through both greenhouse absorption and albedo modification, creating a complex three-dimensional atmospheric structure where temperature inversions and convective processes distribute heat globally. The planet\'s retrograde rotation (angular velocity -1.48 × 10^-7 rad/s) and extremely long rotational period (243.025 Earth days) result in minimal Coriolis effects and highly efficient meridional heat transport, eliminating temperature gradients between hemispheres and maintaining thermal equilibrium across day-night boundaries. Atmospheric circulation patterns driven by radiative heating create superrotation phenomena where upper atmospheric winds reach velocities exceeding 100 m/s while surface winds remain relatively quiescent (< 2 m/s). Venus\'s atmospheric evolution likely involved a runaway greenhouse process initiated during the planet\'s early formation when increasing stellar luminosity and potential water vapor feedback effects caused progressive ocean evaporation, enhanced atmospheric opacity, and eventual hydrogen escape through hydrodynamic processes. Photodissociation of water molecules in the upper atmosphere led to hydrogen loss rates exceeding planetary retention capabilities, while liberated oxygen combined with surface minerals through oxidation reactions, ultimately eliminating surface water reservoirs entirely. This planetary transformation provides critical insights for understanding climate tipping points, atmospheric stability thresholds, and the long-term evolution of planetary habitability zones, particularly relevant for assessing anthropogenic climate change impacts on Earth and evaluating exoplanet atmospheric conditions for astrobiology research. Comparative planetology studies utilizing Venus as a "failed Earth" analog help scientists understand the narrow parameter ranges required for maintaining liquid water, temperate surface conditions, and potentially habitable environments over geological timescales.';
            break;
          case 'neutron':
            content = 'Neutron stars represent the ultimate manifestation of gravitational collapse and nuclear matter compression, existing at the intersection of quantum mechanics, general relativity, and nuclear physics while providing unique laboratories for testing fundamental theories under conditions impossible to replicate terrestrially. These exotic objects form through the catastrophic core collapse of massive stars (typically 8-25 M☉) during Type II supernova events when nuclear fusion processes can no longer generate sufficient radiation pressure to counteract gravitational contraction. The collapse process involves core densities approaching the Chandraseklar limit (approximately 3 × 10^9 kg/m³), causing electron degeneracy pressure to fail and initiating inverse beta decay reactions (p + e^- → n + ν_e) that convert protons and electrons into neutrons while releasing enormous quantities of neutrinos. The resulting neutron star contains approximately 1.4 M☉ compressed into a sphere 20-24 kilometers in diameter, achieving central densities of 3-8 × 10^17 kg/m³ that approach nuclear saturation density (2.3 × 10^17 kg/m³) and create gravitational field strengths reaching 2 × 10^11 m/s² at the surface. These extreme conditions produce matter in states that challenge our understanding of fundamental physics: the outer crust consists of atomic nuclei arranged in crystalline lattices with electrons forming a degenerate gas, the inner crust contains increasingly neutron-rich nuclei surrounded by superfluid neutron gas, and the core may harbor exotic matter including hyperons, kaon condensates, pion condensates, or even deconfined quark matter in strange or color-flavor-locked phases. Neutron star structure models incorporate equation-of-state calculations that must account for strong nuclear interactions, quantum chromodynamics, and potential phase transitions between different matter states, with observational constraints provided by mass-radius measurements, cooling curves, and gravitational wave detections from binary neutron star mergers. The extreme magnetic field strengths (10^8 to 10^15 Tesla) generated during stellar collapse create magnetospheric environments that accelerate charged particles to relativistic energies, producing coherent electromagnetic radiation beams observable as pulsar signals when geometrically aligned with Earth. These natural atomic clocks provide precision timing capabilities that have enabled tests of general relativity, detection of gravitational waves, constraints on nuclear matter properties, and measurements of neutron star masses through binary orbital dynamics. Recent multimessenger astronomy observations of neutron star mergers (GW170817/GRB170817A/AT2017gfo) have confirmed theoretical predictions about r-process nucleosynthesis, provided independent measurements of the Hubble constant, and constrained the neutron star equation of state through gravitational wave analysis. Ongoing research focuses on understanding the maximum neutron star mass, the nature of matter at supranuclear densities, magnetic field evolution and decay mechanisms, cooling processes involving superfluidity and neutrino emission, and the potential existence of strange quark stars or hybrid star configurations that could fundamentally alter our understanding of matter under extreme conditions.';
            break;
          case 'speed':
            content = 'Our cosmic trajectory through space represents a complex superposition of multiple hierarchical motions operating across vastly different scales, from planetary rotation to cosmic expansion, demonstrating fundamental principles of celestial mechanics, reference frame transformations, and the large-scale structure of the universe. Earth\'s rotational motion at 1,674 km/h (465 m/s) at the equator results from our planet\'s angular velocity of 7.27 × 10^-5 rad/s and creates centrifugal acceleration that reduces effective gravitational force by approximately 0.3%, while generating the Coriolis effect (proportional to 2Ω × v) that deflects moving objects and influences atmospheric circulation patterns, ocean currents, and weather system dynamics. Our orbital motion around the Sun proceeds at 29.78 km/s in an elliptical trajectory with semi-major axis 1.496 × 10^8 km, eccentricity 0.0167, and period 365.25636 days, maintaining stable orbital mechanics through gravitational force balance (F = GMm/r²) while experiencing seasonal variations in orbital velocity due to Kepler\'s second law (conservation of angular momentum). The Solar System\'s galactic motion involves complex dynamics as we orbit the Milky Way\'s center at approximately 230 km/s, following a path influenced by the galaxy\'s spiral density wave structure, central supermassive black hole (Sagittarius A*), and dark matter distribution that constitutes ~85% of the galaxy\'s total mass. Our galactic orbital period (one "cosmic year") spans 225-250 million Earth years, during which the Solar System oscillates vertically through the galactic plane with an amplitude of ~70 parsecs and period of ~30 million years, potentially correlating with terrestrial extinction events through interactions with molecular clouds and cosmic ray flux variations. Beyond galactic scales, our Local Group of galaxies moves at approximately 627 km/s relative to the cosmic microwave background rest frame, representing motion inherited from primordial density fluctuations and ongoing gravitational attraction toward the Virgo Cluster, Great Attractor, and Shapley Supercluster. This hierarchical motion structure illustrates how gravitational systems organize across multiple scales, from planetary satellites to galaxy clusters, with each level contributing to our total velocity vector through space. The principle of general covariance ensures that no absolute reference frame exists for measuring "true" cosmic velocity, making all motion relative to chosen coordinate systems, while special relativity dictates that no information can propagate faster than the speed of light (2.998 × 10^8 m/s), providing an absolute velocity scale for electromagnetic interactions. These nested reference frames demonstrate how astronomical objects participate simultaneously in multiple gravitational systems, with Earth constantly exploring previously unvisited regions of spacetime while maintaining dynamic equilibrium within each hierarchical level through precise balance between gravitational attraction, centrifugal acceleration, and conservation of angular momentum across cosmic time scales.';
            break;
          case 'search':
            content = `The comprehensive study of ${topic} represents a multidisciplinary scientific endeavor that integrates theoretical frameworks, experimental methodologies, and computational modeling to understand complex systems and their emergent properties. Research in this field employs sophisticated analytical techniques including spectroscopic analysis, molecular dynamics simulations, statistical mechanics calculations, and advanced instrumentation to probe fundamental mechanisms operating at molecular, cellular, or systemic levels depending on the specific focus area. These investigations reveal intricate networks of cause-and-effect relationships that extend across multiple scales of organization, demonstrating how ${topic} influences and responds to various environmental, chemical, biological, or physical parameters through feedback loops, nonlinear dynamics, and threshold effects that can produce unexpected emergent behaviors. The practical applications derived from ${topic} research have generated transformative technologies, therapeutic interventions, sustainable solutions, or industrial processes that address critical societal challenges while simultaneously expanding the frontiers of scientific knowledge and opening new research directions. Current research paradigms emphasize interdisciplinary collaboration, incorporating insights from physics, chemistry, biology, mathematics, engineering, and computational sciences to develop comprehensive theoretical models that can predict system behavior under diverse conditions and guide experimental design for hypothesis testing. Advanced analytical methods including machine learning algorithms, high-throughput screening techniques, and precision measurement technologies enable researchers to process vast datasets, identify subtle patterns, and quantify previously unmeasurable phenomena with unprecedented accuracy and resolution. The fundamental principles governing ${topic} often reveal unexpected connections to other scientific domains, contributing to our broader understanding of natural laws, conservation principles, symmetries, and the underlying mathematical structures that describe physical reality. Future research directions promise to address pressing questions about optimization, sustainability, efficiency, and fundamental limits while potentially leading to paradigm-shifting discoveries that could revolutionize our understanding of ${topic} and its role within the broader context of natural phenomena, technological applications, and societal impact.`;
            break;
          default:
            content = 'This complex scientific domain represents a convergence of multiple theoretical frameworks and experimental methodologies that reveal intricate systems operating across different scales of organization. Research employs sophisticated analytical techniques to understand fundamental mechanisms and their emergent properties, leading to transformative applications and new research directions.';
        }
        break;

      default:
        content = selectedStory.baseContent;
    }

    return [{
      id: Math.random().toString(),
      title: selectedStory.title,
      content: content,
      category: category || 'Random',
      ageRange: ageRange,
      icon: getIconForCategory(category || 'Random')
    }];
  };

  const getIconForCategory = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Science': '🧪',
      'History': '🏺',
      'Technology': '💻',
      'Nature': '🌿',
      'Space': '🚀',
      'Arts': '🎨',
      'Culture': '🌍',
      'Random': '🎲'
    };
    return categoryMap[category] || '📖';
  };

  const generateStories = async (topic: string, category?: string) => {
    if (!selectedAgeRange) {
      alert('Please select an age range first!');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const generatedStories = generateAgeAppropriateContent(topic, category || '', selectedAgeRange);
      setStories(generatedStories);
      setIsLoading(false);
      setShowStoriesPage(true);
    }, 800);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    generateStories('', category);
  };

  const handleAgeRangePress = (ageRange: string) => {
    setSelectedAgeRange(ageRange);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSelectedCategory('');
      generateStories(searchTerm);
    }
  };

  const handleRefresh = () => {
    generateStories(searchTerm, selectedCategory || 'Random');
  };

  const openStoryModal = (story: CurioStory) => {
    setSelectedStory(story);
    setModalVisible(true);
  };

  const closeStoryModal = () => {
    setModalVisible(false);
    setSelectedStory(null);
  };

  const goBackToHome = () => {
    setShowStoriesPage(false);
    setStories([]);
    setSelectedCategory('');
    setSearchTerm('');
    // Keep selectedAgeRange so user doesn't have to reselect
  };

  // Split categories into two rows
  const firstRowCategories = categories.slice(0, 4);
  const secondRowCategories = categories.slice(4);

  // Split age ranges into two rows
  const firstRowAgeRanges = ageRanges.slice(0, 3);
  const secondRowAgeRanges = ageRanges.slice(3);

  if (showStoriesPage) {
    return (
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.storiesHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToHome}
          >
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Refresh Button */}
        <View style={styles.refreshContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>
              ✨ Generate New Stories
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stories */}
        <ScrollView style={styles.storiesScrollView}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Generating fascinating story...</Text>
            </View>
          ) : (
            <View style={styles.storiesContainer}>
              {stories.length > 0 && (
                <TouchableOpacity
                  style={styles.singleStoryCard}
                  onPress={() => openStoryModal(stories[0])}
                >
                  <View style={styles.storyHeader}>
                    <Text style={styles.storyIcon}>{stories[0].icon}</Text>
                    <Text style={styles.storyCategory}>
                      {stories[0].category} • {stories[0].ageRange}
                    </Text>
                  </View>
                  <Text style={styles.storyTitle}>
                    {stories[0].title}
                  </Text>
                  <Text style={styles.storyPreview}>
                    {stories[0].content.substring(0, 150)}...
                  </Text>
                  <Text style={styles.tapToRead}>Tap to read the full story</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Story Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeStoryModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeStoryModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedStory && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.modalStoryHeader}>
                  <Text style={styles.modalStoryIcon}>{selectedStory.icon}</Text>
                  <Text style={styles.modalStoryCategory}>
                    {selectedStory.category} • {selectedStory.ageRange}
                  </Text>
                </View>
                <Text style={styles.modalStoryTitle}>{selectedStory.title}</Text>
                <Text style={styles.modalStoryContent}>{selectedStory.content}</Text>
              </ScrollView>
            )}
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.appTitle}>CurioTales</ThemedText>
        <ThemedText style={styles.tagline}>
          Bite-sized wonders from every corner of knowledge
        </ThemedText>
      </ThemedView>

      {/* Categories */}
      <ThemedView style={styles.categoriesContainer}>
        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <View style={styles.tagsRowContainer}>
          <View style={styles.tagsRow}>
            {firstRowCategories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Text style={styles.chipIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: '#6366f1',
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tagsRow}>
            {secondRowCategories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Text style={styles.chipIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: '#6366f1',
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ThemedView>

      {/* Age Ranges */}
      <ThemedView style={styles.categoriesContainer}>
        <ThemedText style={styles.sectionTitle}>Age Range</ThemedText>
        <View style={styles.tagsRowContainer}>
          <View style={styles.tagsRow}>
            {firstRowAgeRanges.map((ageRange) => (
              <TouchableOpacity
                key={ageRange.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedAgeRange === ageRange.name ? '#6366f1' : 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleAgeRangePress(ageRange.name)}
              >
                <Text style={styles.chipIcon}>{ageRange.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedAgeRange === ageRange.name ? '#fff' : '#6366f1',
                    },
                  ]}
                >
                  {ageRange.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tagsRow}>
            {secondRowAgeRanges.map((ageRange) => (
              <TouchableOpacity
                key={ageRange.name}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedAgeRange === ageRange.name ? '#6366f1' : 'white',
                    borderColor: '#6366f1',
                  },
                ]}
                onPress={() => handleAgeRangePress(ageRange.name)}
              >
                <Text style={styles.chipIcon}>{ageRange.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedAgeRange === ageRange.name ? '#fff' : '#6366f1',
                    },
                  ]}
                >
                  {ageRange.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Type any topic here"
            placeholderTextColor="#6b7280"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#6b7280',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  tagsRowContainer: {
    gap: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
    minHeight: 40,
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 400,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2937',
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: '#6366f1',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  storiesHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
  refreshContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#6366f1',
    backgroundColor: 'white',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366f1',
  },
  storiesScrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  storiesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
  },
  storiesGrid: {
    gap: 16,
  },
  storyCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  singleStoryCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  tapToRead: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storyIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  storyCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6366f1',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
    color: '#1f2937',
  },
  storyPreview: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
    backgroundColor: 'white',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalStoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalStoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  modalStoryCategory: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6366f1',
  },
  modalStoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 32,
    color: '#1f2937',
  },
  modalStoryContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    paddingBottom: 40,
  },
});
