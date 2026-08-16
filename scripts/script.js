(function() {
    "use strict";

    // 1. OBFUSCATION UTILS
    const SALT = "JEESECURE_2025_SALT_"; 
    const obfuscate = (str) => {
        try {
            return btoa(unescape(encodeURIComponent(SALT + String(str || ''))));
        } catch(e) {
            return "OBF_" + encodeURIComponent(String(str || ''));
        }
    };
    const deobfuscate = (str) => {
        try {
            if (!str) return '';
            const s = String(str);
            if (s.startsWith("OBF_")) return decodeURIComponent(s.replace("OBF_", ""));
            return decodeURIComponent(escape(atob(s))).replace(SALT, '');
        } catch(e) {
            return String(str || '');
        }
    };
    
    // 2. CENTRAL QUESTION DATABASE
    // IMPORTANT: Use double backslashes (\\) for LaTeX commands in JS strings.
    const PAPER_DATABASE = {
        // PAPER 1 (Pre-filled)
        1: [
            { section: "Physics", content: "\\(P + a/V^2 (V - b) = RT\\) represents the equation of state of some gases. Where P is the pressure, V is the volume, T is the temperature and a, b, R are the constants. The physical quantity, which has dimensional formula as that of \\(b^2/a\\), will be:", options: ["Bulk modulus", "Modulus of rigidity", "Compressibility", "Energy density"], answer: "Compressibility" },
                { section: "Physics", content: "An object moves with speed \\(v_1, v_2,\\) and \\(v_3\\) along a line segment AB, BC and CD respectively. Where AB = BC and AD = 3AB, then average speed of the object will be:", options: ["\\((v_1 + v_2 + v_3)/3\\)", "\\(v_1v_2v_3 / (3v_1v_2 + v_2v_3 + v_3v_1)\\)", "\\(3v_1v_2v_3 / (v_1v_2 + v_2v_3 + v_3v_1)\\)", "\\((v_1 + v_2 + v_3) / (3v_1v_2v_3)\\)"], answer: "\\(3v_1v_2v_3 / (v_1v_2 + v_2v_3 + v_3v_1)\\)" },
                { section: "Physics", content: "A child stands on the edge of the cliff 10 m above the ground and throws a stone horizontally with an initial speed of \\(5 m s^{-1}\\). Neglecting the air resistance, the speed with which the stone hits the ground will be _____ \\(m s^{-1}\\) (given, \\(g = 10 m s^{-2}\\)).", options: ["20", "15", "30", "25"], answer: "15" },
                { section: "Physics", content: "A block of mass 5 kg is placed at rest on a table of rough surface. Now, if a force of 30 N is applied in the direction parallel to surface of the table, the block slides through a distance of 50 m in an interval of time 10 s. Coefficient of kinetic friction is (given, \\(g = 10 m s^{-2}\\)):", options: ["0.60", "0.75", "0.50", "0.25"], answer: "0.50" },
                { section: "Physics", content: "If earth has a mass nine times and radius twice to that of a planet P. Then \\(v_e / (3\\sqrt{x}) ms^{-1}\\) will be the minimum velocity required by a rocket to pull out of gravitational force of P, where \\(v_e\\) is escape velocity on earth. The value of x is:", options: ["2", "3", "18", "1"], answer: "2" },
                { section: "Physics", content: "Given below are two statements:<br><b>Statement-I:</b> Acceleration due to gravity is different at different places on the surface of earth.<br><b>Statement-II:</b> Acceleration due to gravity increases as we go down below the earth's surface.<br>In the light of the above statements, choose the correct answer.", options: ["Both Statement I and Statement II are true", "Both Statement I and Statement II are false", "Statement I is true but Statement II is false", "Statement I is false but Statement II is true"], answer: "Statement I is true but Statement II is false" },
                { section: "Physics", content: "A mercury drop of radius \\(10^{-3}\\) m is broken into 125 equal size droplets. Surface tension of mercury is \\(0.45 N m^{-1}\\). The gain in surface energy is:", options: ["\\(2.26 \\times 10^{-5} J\\)", "\\(28 \\times 10^{-5} J\\)", "\\(17.5 \\times 10^{-5} J\\)", "\\(5 \\times 10^{-5} J\\)"], answer: "\\(2.26 \\times 10^{-5} J\\)" },
                { section: "Physics", content: "A sample of gas at temperature T is adiabatically expanded to double its volume. The work done by the gas in the process is (given \\(\\gamma = 3/2\\)):", options: ["\\(W = TR(\\sqrt{2} - 2)\\)", "\\(W = (T/R)(\\sqrt{2} - 2)\\)", "\\(W = (R/T)(2 - \\sqrt{2})\\)", "\\(W = RT(2 - \\sqrt{2})\\)"], answer: "\\(W = RT(2 - \\sqrt{2})\\)" },
                { section: "Physics", content: "The average kinetic energy of a molecule of the gas is:", options: ["proportional to absolute temperature", "proportional to volume", "proportional to pressure", "dependent on the nature of the gas"], answer: "proportional to absolute temperature" },
                { section: "Physics", content: "A steel wire with mass per unit length \\(7.0 \\times 10^{-3} kg m^{-1}\\) is under tension of 70 N. The speed of transverse waves in the wire will be:", options: ["\\(200\\pi m s^{-1}\\)", "\\(100 m s^{-1}\\)", "\\(10 m s^{-1}\\)", "\\(50 m s^{-1}\\)"], answer: "\\(100 m s^{-1}\\)" },
                { section: "Physics", content: "Let \\(\\sigma\\) be the uniform surface charge density of two infinite thin plane sheets. Then the electric fields in three different regions \\(E_I, E_{II}\\) and \\(E_{III}\\) are:", options: ["\\(E_I = 2\\sigma/\\epsilon_0 \\hat{n}, E_{II} = 0, E_{III} = 2\\sigma/\\epsilon_0 \\hat{n}\\)", "\\(E_I = 0, E_{II} = \\sigma/\\epsilon_0 \\hat{n}, E_{III} = 0\\)", "\\(E_I = \\sigma/(2\\epsilon_0) \\hat{n}, E_{II} = 0, E_{III} = \\sigma/(2\\epsilon_0) \\hat{n}\\)", "\\(E_I = -\\sigma/\\epsilon_0 \\hat{n}, E_{II} = 0, E_{III} = \\sigma/\\epsilon_0 \\hat{n}\\)"], answer: "\\(E_I = -\\sigma/\\epsilon_0 \\hat{n}, E_{II} = 0, E_{III} = \\sigma/\\epsilon_0 \\hat{n}\\)" },
                { section: "Physics", content: "The equivalent resistance between A and B of the network shown in the figure is:<br><div class='flex justify-center my-4'><img src='images/1.png' alt='Circuit Diagram'></div>", options: ["112R/3", "14R", "21R", "8R/3"], answer: "8R/3" },
                { section: "Physics", content: "Find the magnetic field at the point P. The curved portion is a semicircle connected to two long straight wires.<br><div class='flex justify-center my-4'><img src='images/2.png' alt='Semicircle Wire'></div>", options: ["\\(\\mu_0i / (2r) \\cdot (1 + 2/\\pi)\\)", "\\(\\mu_0i / (2r) \\cdot (1 + 1/\\pi)\\)", "\\(\\mu_0i / (2r) \\cdot (1/2 + 1/(2\\pi))\\)", "\\(\\mu_0i / (2r) \\cdot (1/2 + 1/\\pi)\\)"], answer: "\\(\\mu_0i / (2r) \\cdot (1/2 + 1/(2\\pi))\\)" },
                { section: "Physics", content: "Match List-I with List-II:<br><b>List I:</b> (A) AC generator, (B) Transformer, (C) Resonance phenomenon, (D) Sharpness of resonance<br><b>List II:</b> (I) Presence of both L and C, (II) Electromagnetic Induction, (III) Quality factor, (IV) Mutual Inductance", options: ["A-IV, B-II, C-I, D-III", "A-II, B-I, C-III, D-IV", "A-II, B-IV, C-I, D-III", "A-IV, B-III, C-I, D-II"], answer: "A-II, B-IV, C-I, D-III" },
                { section: "Physics", content: "Match List-I with List-II:<br><b>List I:</b> (A) Microwaves, (B) Gamma rays, (C) Radio waves, (D) X-rays<br><b>List II:</b> (I) Radioactive decay of the nucleus, (II) Rapid acceleration and deceleration of electron in aerials, (III) Inner shell electrons, (IV) Klystron valve", options: ["A-I, B-II, C-III, D-IV", "A-IV, B-I, C-II, D-III", "A-I, B-III, C-IV, D-II", "A-IV, B-III, C-II, D-I"], answer: "A-IV, B-I, C-II, D-III" },
                { section: "Physics", content: "‘n’ polarizing sheets are arranged such that each makes an angle 45° with the preceeding sheet. An unpolarized light of intensity I is incident into this arrangement. The output intensity is found to be I/64. The value of n will be:", options: ["3", "6", "5", "4"], answer: "6" },
                { section: "Physics", content: "A proton moving with one tenth of velocity of light has a certain de Broglie wavelength of \\(\\lambda\\). An alpha particle having certain kinetic energy has the same de-Broglie wavelength \\(\\lambda\\). The ratio of kinetic energy of proton and that of alpha particle is:", options: ["2 : 1", "4 : 1", "1 : 2", "1 : 4"], answer: "4 : 1" },
                { section: "Physics", content: "The mass of proton, neutron and helium nucleus are respectively 1.0073 u, 1.0087 u and 4.0015u. The binding energy of helium nucleus is:", options: ["14.2 MeV", "28.4 MeV", "56.8 MeV", "7.1 MeV"], answer: "28.4 MeV" },
                { section: "Physics", content: "Match List I with List II:<br><b>List I:</b> (A) Intrinsic Semiconductor, (B) n-type semiconductor, (C) p-type semiconductor, (D) Metals<br><b>List II:</b> (I) Fermi-level near valence band, (II) Fermi-level at middle of valence and conduction band, (III) Fermi-level near conduction band, (IV) Fermi-level inside conduction band", options: ["(A)→I, (B)→II, (C)→III, (D)→IV", "(A)→II, (B)→I, (C)→III, (D)→IV", "(A)→II, (B)→III, (C)→I, (D)→IV", "(A)→III, (B)→I, (C)→II, (D)→IV"], answer: "(A)→II, (B)→III, (C)→I, (D)→IV" },
                { section: "Physics", content: "Which of the following frequencies does not belong to FM broadcast.", options: ["106 MHz", "64 MHz", "99 MHz", "89 MHz"], answer: "64 MHz" },
                { section: "Physics", content: "A small particle moves to position \\(5\\hat{i} - 2\\hat{j} + \\hat{k}\\) from its initial position \\(2\\hat{i} + 3\\hat{j} - 4\\hat{k}\\) under the action of force \\(5\\hat{i} + 2\\hat{j} + 7\\hat{k}\\) N. The value of work done will be ______ J.", options: [], answer: "40" },
                { section: "Physics", content: "A solid cylinder is released from rest from the top of an inclined plane of inclination 30° and length 60 cm. If the cylinder rolls without slipping, its speed upon reaching the bottom of the inclined plane is ______ \\(m s^{-1}\\). (Given \\(g = 10 m s^{-2}\\))", options: [], answer: "2" },
                { section: "Physics", content: "A certain pressure 'P' is applied to 1 litre of water and 2 litre of a liquid separately. Water gets compressed to 0.01% whereas the liquid gets compressed to 0.03%. The ratio of Bulk modulus of water to that of the liquid is 3/x. The value of x is ______.", options: [], answer: "1" },
                { section: "Physics", content: "The amplitude of a particle executing SHM is 3 cm. The displacement at which its kinetic energy will be 25% more than the potential energy is: ______ cm.", options: [], answer: "2" },
                { section: "Physics", content: "Two equal positive point charges are separated by a distance 2a. The distance of a point from the centre of the line joining two charges on the equatorial line (perpendicular bisector) at which force experienced by a test charge \\(q_0\\) becomes maximum is \\(a/\\sqrt{x}\\). The value of x is ______.", options: [], answer: "2" },
                { section: "Physics", content: "In an experiment to find emf of a cell using potentiometer, the length of null point for a cell of emf 1.5 V is found to be 60 cm. If this cell is replaced by another cell of emf E, the length-of null point increases by 40 cm. The value of E is x/10 V. The value of x is ______.", options: [], answer: "25" },
                { section: "Physics", content: "A charge particle of \\(2 \\mu C\\) accelerated by a potential difference of 100 V enters a region of uniform magnetic field of magnitude 4 mT at right angle to the direction of field. The charge particle completes semicircle of radius 3 cm inside magnetic field. The mass of the charge particle is ______ \\(\\times 10^{-18}\\) kg.", options: [], answer: "144" },
                { section: "Physics", content: "A series LCR circuit is connected to an ac source of 220 V, 50 Hz. The circuit contain a resistance R = 100 \\(\\Omega\\) and an inductor of inductive reactance \\(X_L = 79.6 \\Omega\\). The capacitance of the capacitor needed to maximize the average rate at which energy is supplied will be ______ \\(\\mu F\\).", options: [], answer: "40" },
                { section: "Physics", content: "A thin cylindrical rod of length 10 cm is placed horizontally on the principle axis of a concave mirror of focal length 20 cm. The rod is placed in a such a way that mid point of the rod is at 40 cm from the pole of mirror. The length of the image formed by the mirror will be x/3 cm. The value of x is ______.", options: [], answer: "32" },
                { section: "Physics", content: "A light of energy 12.75 eV is incident on a hydrogen atom in its ground state. The atom absorbs the radiation and reaches to one of its excited states. The angular momentum of the atom in the excited state is \\(x/\\pi \\times 10^{-17}\\) eVs. The value of x is ______ (use \\(h = 4.14 \\times 10^{-15}\\) eVs, \\(c = 3 \\times 10^8 m s^{-1}\\))", options: [], answer: "828" },
                // Chemistry
                { section: "Chemistry", content: "<b>Assertion A:</b> Hydrogen is an environment friendly fuel.<br><b>Reason R:</b> Atomic number of hydrogen is 1 and it is a very light element.", options: ["A is true but R is false", "Both A and R are true but R is NOT the correct explanation of A", "A is false but R is true", "Both A and R are true and R is the correct explanation of A"], answer: "Both A and R are true but R is NOT the correct explanation of A" },
                { section: "Chemistry", content: "Match List I with List II<br>(A) Slaked lime (I) NaOH<br>(B) Dead burnt plaster (II) \\(Ca(OH)_2\\)<br>(C) Caustic soda (III) \\(Na_2CO_3 \\cdot 10H_2O\\)<br>(D) Washing soda (IV) \\(CaSO_4\\)", options: ["(A)-I, (B)-IV, (C)-II, (D)-III", "(A)-III, (B)-IV, (C)-II, (D)-I", "(A)-II, (B)-IV, (C)-I, (D)-III", "(A)-III, (B)-II, (C)-IV, (D)-I"], answer: "(A)-II, (B)-IV, (C)-I, (D)-III" },
                { section: "Chemistry", content: "Choose the correct statement(s):<br>A. Beryllium oxide is purely acidic in nature.<br>B. Beryllium carbonate is kept in the atmosphere of \\(CO_2\\).<br>C. Beryllium sulphate is readily soluble in water.<br>D. Beryllium shows anomalous behavior.", options: ["A, B and C only", "B, C and D only", "A and B only", "A only"], answer: "B, C and D only" },
                { section: "Chemistry", content: "Regarding resonance in carbonate ion \\(CO_3^{2-}\\), which of the following is true?<br><div class='flex justify-center my-4'><img src='images/3.png' alt='Resonance Structures'></div>", options: ["It is possible to identify each structure individually by some physical or chemical method.", "All these structures are in dynamic equilibrium with each other.", "Each structure exists for equal amount of time.", "\\(CO_3^{2-}\\) has a single structure i.e., resonance hybrid of the above three structures."], answer: "\\(CO_3^{2-}\\) has a single structure i.e., resonance hybrid of the above three structures." },
                { section: "Chemistry", content: "But-2-yne is reacted separately with one mole of Hydrogen. Reaction with \\(H_2/Pd/C\\) gives product A. Reaction with \\(Na/liq NH_3\\) gives product B. Identify the incorrect statements from the options given below:<br><div class='flex justify-center my-4'><img src='images/4.jpeg' alt='But-2-yne Reaction'></div>A. A is more soluble than B.<br>B. The boiling point & melting point of A are higher and lower than B respectively.<br>C. A is more polar than B because dipole moment of A is zero.<br>D. \\(Br_2\\) adds easily to B than A.", options: ["B and C only", "B, C and D only", "A, C and D only", "A and B only"], answer: "B, C and D only" },
                { section: "Chemistry", content: "How can photochemical smog be controlled?", options: ["By using tall chimneys", "By complete combustion of fuel", "By using catalytic converters in the automobiles/industry", "By using catalyst"], answer: "By using catalytic converters in the automobiles/industry" },
                { section: "Chemistry", content: "Which of the following represents the lattice structure of \\(A_{0.95}O\\) containing \\(A^{2+}, A^{3+}\\) and \\(O^{2-}\\) ions?", options: ["A: 0.90 \\(A^{2+}\\), 0.05 \\(A^{3+}\\), 1 \\(O^{2-}\\)", "B: 0.85 \\(A^{2+}\\), 0.10 \\(A^{3+}\\), 1 \\(O^{2-}\\)", "C: 0.95 \\(A^{2+}\\), 0.00 \\(A^{3+}\\), 1 \\(O^{2-}\\)", "A and B only"], answer: "A: 0.90 \\(A^{2+}\\), 0.05 \\(A^{3+}\\), 1 \\(O^{2-}\\)" },
                { section: "Chemistry", content: "<b>Assertion A:</b> Amongst He, Ne, Ar and Kr; 1 g of activated charcoal adsorbs more of Kr.<br><b>Reason R:</b> The critical volume \\(V_c\\) and critical pressure \\(P_c\\) is highest for Krypton but the compressibility factor at critical point \\(Z_c\\) is lowest for Krypton.", options: ["A is true but R is false", "A is false but R is true", "Both A and R are true but R is NOT the correct explanation of A", "Both A and R are true and R is the correct explanation A"], answer: "A is true but R is false" },
                { section: "Chemistry", content: "<b>Assertion A:</b> In an Ellingham diagram, the oxidation of carbon to carbon monoxide shows a negative slope with respect to temperature.<br><b>Reason R:</b> CO tends to get decomposed at higher temperature.", options: ["Both A and R are correct and R is the correct explanation of A", "A is not correct but R is correct", "Both A and R are correct but R is NOT the correct explanation of A", "A is correct but R is not correct"], answer: "A is correct but R is not correct" },
                { section: "Chemistry", content: "<b>Statement I:</b> Chlorine can easily combine with oxygen to form oxides: and the product has a tendency to explode.<br><b>Statement II:</b> Chemical reactivity of an element can be determined by its reaction with oxygen and halogens.", options: ["Both the statements I and II are true", "Statement I is true but Statement II is false", "Statement I is false but Statement II is true", "Both the Statements I and II are false"], answer: "Both the statements I and II are true" },
                { section: "Chemistry", content: "A solution of \\(FeCl_3\\) when treated with \\(K_4[Fe(CN)_6]\\) gives a prussian blue precipitate due to the formation of:", options: ["\\(KFe_2[CN]_6\\)", "\\(Fe[Fe(CN)_6]\\)", "\\(Fe_3[Fe(CN)_6]_2\\)", "\\(Fe_4[Fe(CN)_6]_3\\)"], answer: "\\(Fe_4[Fe(CN)_6]_3\\)" },
                { section: "Chemistry", content: "Highest oxidation state of Mn is exhibited in \\(Mn_2O_7\\). The correct statements about \\(Mn_2O_7\\) are:<br><div class='flex justify-center my-4'><img src='images/5.jpeg' alt='Mn2O7 Structure'></div>(A) Mn is tetrahedrally surrounded by oxygen atoms<br>(B) Mn is octahedrally surrounded by oxygen atoms<br>(C) Contains Mn-O-Mn bridge<br>(D) Contains Mn-Mn bond.", options: ["A and C only", "A and D only", "B and D only", "B and C only"], answer: "A and C only" },
                { section: "Chemistry", content: "Which of the following complex will show largest splitting of d-orbitals?", options: ["\\([Fe(C_2O_4)_3]^{3-}\\)", "\\([FeF_6]^{3-}\\)", "\\([Fe(CN)_6]^{3-}\\)", "\\([Fe(NH_3)_6]^{3+}\\)"], answer: "\\([Fe(CN)_6]^{3-}\\)" },
                { section: "Chemistry", content: "Which of the following are the example of double salt?<br>(A) \\(FeSO_4 \\cdot (NH_4)_2SO_4 \\cdot 6H_2O\\)<br>(B) \\(CuSO_4 \\cdot 4NH_3 \\cdot H_2O\\)<br>(C) \\(K_2SO_4 \\cdot Al_2(SO_4)_3 \\cdot 24H_2O\\)<br>(D) \\(Fe(CN)_2 \\cdot 4KCN\\)", options: ["A and C only", "A and B only", "A, B and D only", "B and D only"], answer: "A and C only" },
                { section: "Chemistry", content: "Identify the incorrect reaction option from the following:", options: ["Phenol + Zn dust → Benzene", "Aniline + \\(NaNO_2/HCl\\) (0-5°C) → Benzene diazonium chloride", "Benzaldehyde + Zn-Hg/HCl → Toluene", "Benzene + \\(CH_3Cl\\)/Anhydrous \\(AlCl_3\\) → Toluene"], answer: "Aniline + \\(NaNO_2/HCl\\) (0-5°C) → Benzene diazonium chloride" },
                { section: "Chemistry", content: "Decreasing order of dehydration of the following alcohols is: a) tert-butyl alcohol b) n-butyl alcohol c) sec-butyl alcohol d) iso-butyl alcohol", options: ["a > d > b > c", "b > d > c > a", "b > a > d > c", "d > b > c > a"], answer: "b > d > c > a" },
                { section: "Chemistry", content: "In the reaction: Anisole + HI → Product 'A', 'A' is:", options: ["Benzene + \\(CH_3I\\)", "Phenol + \\(CH_3I\\)", "Iodobenzene + \\(CH_3OH\\)", "Benzene + \\(CH_3OH\\)"], answer: "Phenol + \\(CH_3I\\)" },
                { section: "Chemistry", content: "Match List I with List II:<br><b>List I:</b> (A) Tranquilizers, (B) Aspirin, (C) Antibiotic, (D) Antiseptic<br><b>List II:</b> (I) Anti blood clotting, (II) Salvarsan, (III) Antidepressant drugs, (IV) Soframicine", options: ["(A)–IV, (B)–II, (C)–I, (D)–III", "(A)–II, (B)–I, (C)–III, (D)–IV", "(A)–III, (B)–I, (C)–II, (D)–IV", "(A)–II, (B)–IV, (C)–I, (D)–III"], answer: "(A)–III, (B)–I, (C)–II, (D)–IV" },
                { section: "Chemistry", content: "The correct representation in six membered pyranose form for the sugar D-glucose is:<br><div class='flex justify-center my-4'><img src='images/6.jpeg' alt='D-Glucose Pyranose Form'></div>", options: ["alpha-D-glucopyranose", "beta-D-glucopyranose", "alpha-L-glucopyranose", "beta-L-glucopyranose"], answer: "beta-D-glucopyranose" },
                { section: "Chemistry", content: "Match List I and List II:<br><b>List I (Test):</b> (A) Molisch's Test, (B) Biuret Test, (C) Carbylamine Test, (D) Schiff's Test<br><b>List II (Functional group):</b> (I) Peptide, (II) Carbohydrate, (III) Primary amine, (IV) Aldehyde", options: ["(A)-I, (B)-II, (C)-III, (D)-IV", "(A)-III, (B)-IV, (C)-I, (D)-II", "(A)-II, (B)-I, (C)-III, (D)-IV", "(A)-III, (B)-IV, (C)-II, (D)-I"], answer: "(A)-II, (B)-I, (C)-III, (D)-IV" },
                { section: "Chemistry", content: "The density of 3M solution of NaCl is \\(1.0 g mL^{-1}\\). Molality of the solution is ______ \\(\\times 10^{-2}\\) m (Nearest integer). Given: Molar mass of Na and Cl is 23 and 35.5 \\(g mol^{-1}\\) respectively.", options: [], answer: "364" },
                { section: "Chemistry", content: "Electrons in a cathode ray tube have been emitted with a velocity of \\(1000 ms^{-1}\\). The number of following statements which is/are true about the emitted radiation is ______.<br>(A) The deBroglie wavelength of the electron emitted is 666.67 nm<br>(B) The characteristic of electrons emitted depend upon the material of the electrodes of the cathode ray tube.<br>(C) The cathode rays start from cathode and move towards anode.<br>(D) The nature of the emitted electrons depends on the nature of the gas present in cathode ray tube.", options: [], answer: "2" },
                { section: "Chemistry", content: "At 25°C, enthalpies are given: \\(H_2(g)+O_2(g) \\rightarrow 2OH(g) \\Delta H=78kJ\\); \\(H_2(g)+1/2O_2(g) \\rightarrow H_2O(g) \\Delta H=-242kJ\\); \\(H_2(g) \\rightarrow 2H(g) \\Delta H=436kJ\\); \\(1/2O_2(g) \\rightarrow O(g) \\Delta H=249kJ\\). What is \\(\\Delta H\\) for \\(H_2O(g) \\rightarrow H(g)+OH(g)\\)? (Nearest integer)", options: [], answer: "499" },
                { section: "Chemistry", content: "(i) \\(X(g) \\rightleftharpoons Y(g) + Z(g) K_{p1}=3\\)<br>(ii) \\(A(g) \\rightleftharpoons 2B(g) K_{p2}=1\\)<br>If the degree of dissociation and initial concentration of both reactants X(g) and A(g) are equal, then the ratio of the total pressure at equilibrium \\(p_1/p_2\\) is equal to x:1. The value of x is ______.", options: [], answer: "12" },
                { section: "Chemistry", content: "The total number of chiral compound/s from a given list of structures is ______. (List includes: 2-chlorobutane, 1-chlorobutane, 2,3-dichloropentane, etc.)", options: [], answer: "2" },
                { section: "Chemistry", content: "25 mL of an aqueous solution of KCl was found to require 20 mL of 1M AgNO₃ solution when titrated using \\(K_2CrO_4\\) as an indicator. What is the depression in freezing point of KCl solution of the given concentration? (Nearest integer). (Given : \\(K_f = 2.0 K kg mol^{-1}\\))", options: [], answer: "3" },
                { section: "Chemistry", content: "At what pH, given half cell \\(MnO_4^-(0.1M) | Mn^{2+}(0.001 M)\\) will have electrode potential of 1.282 V? (Nearest Integer) Given \\(E^\\circ(MnO_4^-/Mn^{2+}) = 1.54 V\\), \\((2.303RT/F) = 0.059 V\\)", options: [], answer: "3" },
                { section: "Chemistry", content: "A and B are two substances undergoing radioactive decay. The half life of A is 15 min and B is 5 min. If the initial concentration of B is 4 times that of A and they both start decaying at the same time, how much time will it take for their concentrations to be same? ________min.", options: [], answer: "15" },
                { section: "Chemistry", content: "Sum of oxidation states of bromine in bromic acid and perbromic acid is ______.", options: [], answer: "12" },
                { section: "Chemistry", content: "Number of isomeric compounds with molecular formula \\(C_9H_{10}O\\) which (i) do not dissolve in NaOH (ii) do not dissolve in HCl (iii) do not give orange precipitate with 2,4-DNP (iv) on hydrogenation give identical compound with molecular formula \\(C_9H_{12}O\\) is ______.", options: [], answer: "2" },
                 // Maths
                { section: "Maths", content: "Let \\(S = \\{x: x \\in \\mathbb{R} \\text{ and } (\\sqrt{3} + \\sqrt{2})^{x^2-4} + (\\sqrt{3} - \\sqrt{2})^{x^2-4} = 10\\}\\). Then \\(n(S)\\) is equal to:", options: ["2", "4", "6", "0"], answer: "4" },
                { section: "Maths", content: "If the center and radius of the circle \\(|(z-2)/(z-3)| = 2\\) are respectively \\((\\alpha, \\beta)\\) and \\(\\gamma\\), then \\(3\\alpha + \\beta + \\gamma^2\\) is equal to:", options: ["11", "9", "10", "12"], answer: "12" },
                { section: "Maths", content: "The sum to 10 terms of the series \\(\\frac{1}{1+1^2+1^4} + \\frac{2}{1+2^2+2^4} + \\frac{3}{1+3^2+3^4} + \\dots\\) is:", options: ["59/111", "55/111", "56/111", "58/111"], answer: "55/111" },
                { section: "Maths", content: "The value of \\(\\frac{1}{1!50!} + \\frac{1}{3!48!} + \\frac{1}{5!46!} + \\dots + \\frac{1}{51!1!}\\) is:", options: ["\\(2^{50}/50!\\)", "\\(2^{50}/51!\\)", "\\(2^{51}/51!\\)", "\\(2^{51}/50!\\)"], answer: "\\(2^{50}/51!\\)" },
                { section: "Maths", content: "The equation of the angle bisectors of the lines represented by the equation \\(2x^2 + xy - 3y^2 = 0\\) is:", options: ["\\(3x^2 + 5xy + 2y^2 = 0\\)", "\\(x^2 - y^2 + 10xy = 0\\)", "\\(3x^2 + xy - 2y^2 = 0\\)", "\\(x^2 - y^2 - 10xy = 0\\)"], answer: "\\(x^2 - y^2 - 10xy = 0\\)" },
                { section: "Maths", content: "If the orthocentre of the triangle, whose vertices are (1,2), (2,3) and (3,1) is \\((\\alpha, \\beta)\\), then the quadratic equation whose roots are \\(\\alpha+4\\beta\\) and \\(4\\alpha+\\beta\\), is:", options: ["\\(x^2 - 19x + 90 = 0\\)", "\\(x^2 - 18x + 80 = 0\\)", "\\(x^2 - 22x + 120 = 0\\)", "\\(x^2 - 20x + 99 = 0\\)"], answer: "\\(x^2 - 20x + 99 = 0\\)" },
                { section: "Maths", content: "The negation of the expression \\(q \\lor ((\\sim q) \\land p)\\) is equivalent to:", options: ["\\((\\sim p) \\land (\\sim q)\\)", "\\(p \\land (\\sim q)\\)", "\\((\\sim p) \\lor (\\sim q)\\)", "\\((\\sim p) \\lor q\\)"], answer: "\\((\\sim p) \\land (\\sim q)\\)" },
                { section: "Maths", content: "The mean and variance of 5 observations are 5 and 8 respectively. If 3 observations are 1, 3, 5, then the sum of cubes of the remaining two observations is:", options: ["1072", "1792", "1216", "1456"], answer: "1072" },
                { section: "Maths", content: "For a triangle ABC, the value of \\(\\cos(2A) + \\cos(2B) + \\cos(2C)\\) is least. If its inradius is 3 and incentre is M, then which of the following is NOT correct?", options: ["Perimeter of \\(\\Delta ABC\\) is \\(18\\sqrt{3}\\)", "\\(\\sin(2A)+\\sin(2B)+\\sin(2C) = \\sin(A)+\\sin(B)+\\sin(C)\\)", "\\(\\vec{MA} \\cdot \\vec{MB} = -18\\)", "area of \\(\\Delta ABC\\) is \\(27\\sqrt{3}/2\\)"], answer: "area of \\(\\Delta ABC\\) is \\(27\\sqrt{3}/2\\)" },
                { section: "Maths", content: "Let R be a relation on \\(\\mathbb{R}\\), given by \\(R = \\{(a, b): 3a - 3b + \\sqrt{7} \\text{ is an irrational number}\\}\\). Then R is:", options: ["Reflexive but neither symmetric nor transitive", "Reflexive and transitive but not symmetric", "Reflexive and symmetric but not transitive", "An equivalence relation"], answer: "Reflexive but neither symmetric nor transitive" },
                { section: "Maths", content: "Let S denote the set of all real values of \\(\\lambda\\) such that the system of equations \\(\\lambda x+y+z=1, x+\\lambda y+z=1, x+y+\\lambda z=1\\) is inconsistent, then \\(\\sum_{\\lambda \\in S} (\\lambda^2 + \\lambda)\\) is equal to:", options: ["2", "12", "4", "6"], answer: "6" },
                { section: "Maths", content: "Let S be the set of all solutions of the equation \\(\\cos^{-1}(2x) - 2\\cos^{-1}(\\sqrt{1-x^2}) = \\pi, x \\in [-1/2, 1/2]\\). Then \\(\\sum_{x \\in S} 2\\sin^{-1}(x^2-1)\\) is equal to:", options: ["0", "\\(-2\\pi/3\\)", "\\(\\pi - \\sin^{-1}(\\sqrt{3}/4)\\)", "\\(\\pi - 2\\sin^{-1}(\\sqrt{3}/4)\\)"], answer: "0" },
                { section: "Maths", content: "Let \\(f(x) = 2x + \\tan^{-1}(x)\\) and \\(g(x) = \\log_e(\\sqrt{1+x^2} + x), x \\in [0, 3]\\). Then:", options: ["There exists \\(x \\in (0,3)\\) such that \\(f'(x) < g'(x)\\)", "\\(\\max f(x) > \\max g(x)\\)", "There exist \\(0 < x_1 < x_2 < 3\\) such that \\(f(x) < g(x), \\forall x \\in (x_1, x_2)\\)", "\\(\\min f'(x) = 1 + \\max g'(x)\\)"], answer: "\\(\\max f(x) > \\max g(x)\\)" },
                { section: "Maths", content: "Let f(x) be the determinant of a 3x3 matrix with rows \\((1+\\sin^2x, \\cos^2x, \\sin2x)\\), \\((\\sin^2x, 1+\\cos^2x, \\sin2x)\\), \\((\\sin^2x, \\cos^2x, 1+\\sin2x)\\), for \\(x \\in [\\pi/6, \\pi/3]\\). If \\(\\alpha\\) and \\(\\beta\\) are the max and min values of f, then:", options: ["\\(\\beta^2 - 2\\sqrt{\\alpha} = 19/4\\)", "\\(\\beta^2 + 2\\sqrt{\\alpha} = 19/4\\)", "\\(\\alpha^2 - \\beta^2 = 4\\sqrt{3}\\)", "\\(\\alpha^2 + \\beta^2 = 9/2\\)"], answer: "\\(\\beta^2 - 2\\sqrt{\\alpha} = 19/4\\)" },
                { section: "Maths", content: "\\(\\lim_{n\\to\\infty} [\\frac{1}{1+n} + \\frac{1}{2+n} + \\frac{1}{3+n} + \\dots + \\frac{1}{2n}]\\) is equal to:", options: ["0", "\\(\\log_e2\\)", "\\(\\log_e(3/2)\\)", "\\(\\log_e(2/3)\\)"], answer: "\\(\\log_e2\\)" },
                { section: "Maths", content: "The area enclosed by the closed curve C given by \\(dy/dx + (x+a)/(y-2) = 0, y(1)=0\\) is \\(4\\pi\\). Let P,Q be intersection points of C and y-axis. If normals at P,Q on C intersect x-axis at R,S, then length of RS is:<br><div class='flex justify-center my-4'><img src='images/7.jpeg' alt='Curve Graph'></div>", options: ["\\(2\\sqrt{3}\\)", "\\(2\\sqrt{3}/3\\)", "2", "\\(4\\sqrt{3}/3\\)"], answer: "\\(4\\sqrt{3}/3\\)" },
                { section: "Maths", content: "If \\(y=y(x)\\) is the solution curve of \\(dy/dx + y\\tan(x) = x\\sec(x), 0 \\le x \\le \\pi/3, y(0)=1\\), then \\(y(\\pi/6)\\) is equal to:", options: ["\\(\\pi/12 - (\\sqrt{3}/2)\\log_e(2/(e\\sqrt{3}))\\)", "\\(\\pi/12 + (\\sqrt{3}/2)\\log_e(2\\sqrt{3}/e)\\)", "\\(\\pi/12 - (\\sqrt{3}/2)\\log_e(2\\sqrt{3}/e)\\)", "\\(\\pi/12 + (\\sqrt{3}/2)\\log_e(2/(e\\sqrt{3}))\\)"], answer: "\\(\\pi/12 - (\\sqrt{3}/2)\\log_e(2/(e\\sqrt{3}))\\)" },
                { section: "Maths", content: "Let the image of the point P(2, -1, 3) in the plane \\(x + 2y - z = 0\\) be Q. Then the distance of the plane \\(3x + 2y + z + 29 = 0\\) from the point Q is:", options: ["\\(22\\sqrt{2}/7\\)", "\\(24\\sqrt{2}/7\\)", "\\(2\\sqrt{14}\\)", "\\(3\\sqrt{14}\\)"], answer: "\\(3\\sqrt{14}\\)" },
                { section: "Maths", content: "The shortest distance between the lines \\((x-5)/1 = (y-2)/2 = (z-4)/(-3)\\) and \\((x+3)/1 = (y+5)/4 = (z-1)/(-5)\\) is:", options: ["\\(7\\sqrt{3}\\)", "\\(5\\sqrt{3}\\)", "\\(6\\sqrt{3}\\)", "\\(4\\sqrt{3}\\)"], answer: "\\(6\\sqrt{3}\\)" },
                { section: "Maths", content: "In a binomial distribution B(n,p), the sum and product of the mean & variance are 5 and 6 respectively, then \\(6(n+p-q)\\) is equal to:", options: ["51", "52", "53", "50"], answer: "52" },
                { section: "Maths", content: "The number of words, with or without meaning, that can be formed using all the letters of the word ASSASSINATION so that the vowels occur together, is _____.", options: [], answer: "50400" },
                { section: "Maths", content: "Let \\(a_1=8, a_2, a_3, \\dots\\) be an A.P. If the sum of its first four terms is 50 and the sum of its last four terms is 170, then the product of its middle two terms is _____.", options: [], answer: "754" },
                { section: "Maths", content: "The number of 3-digit numbers, that are divisible by either 2 or 3 but not divisible by 7 is _____.", options: [], answer: "514" },
                { section: "Maths", content: "The remainder when \\(19^{200} + 23^{200}\\) is divided by 49, is _____.", options: [], answer: "29" },
                { section: "Maths", content: "If \\(f(x) = x^2 + g'(1)x + g''(2)\\) and \\(g(x) = f(1)x^2 + xf'(x) + f''(x)\\), then the value of \\(f(4) - g(4)\\) is equal to _____.", options: [], answer: "14" },
                { section: "Maths", content: "If \\(\\int_0^1 x^{21}(1+x^7)(2x^{14}+3x^7+6)^{1/7} dx = (1/l)(11)^{m/n}\\) where \\(l,m,n \\in \\mathbb{N}\\), m and n are co-prime then \\(l+m+n\\) is equal to _____.", options: [], answer: "63" },
                { section: "Maths", content: "Let A be the area bounded by the curve \\(y = x|x-3|\\), the x-axis and the ordinates x = -1 and x = 2. Then 12A is equal to _____.", options: [], answer: "62" },
                { section: "Maths", content: "Let \\(f: \\mathbb{R} \\rightarrow \\mathbb{R}\\) be a differentiable function such that \\(f'(x) + f(x) = \\int_0^2 f(t)dt\\). If \\(f(0) = e^{-2}\\), then \\(2f(0) - f(2)\\) is equal to _____.", options: [], answer: "1" },
                { section: "Maths", content: "Let \\(v = \\alpha\\hat{i}+2\\hat{j}-3\\hat{k}, w = 2\\alpha\\hat{i}+\\hat{j}-\\hat{k}\\). If the minimum value of the scalar triple product [u v w] is \\(-\\alpha\\sqrt{3401}\\), \\(|u|=\\sqrt{\\alpha} (\\alpha>0)\\), and \\(|u\\cdot\\hat{i}|^2 = m/n\\) where m,n are coprime, then m+n is equal to _____.", options: [], answer: "3501" },
                { section: "Maths", content: "A(2,6,2), B(-4,0,\\(\\lambda\\)), C(2,3,-1) and D(4,5,0), \\(\\lambda \\le 5\\) are vertices of a quadrilateral ABCD. If its area is 18 square units, then \\(5-6\\lambda\\) is equal to _____:<br><div class='flex justify-center my-4'><img src='images/8.jpeg' alt='Quadrilateral Diagram'></div>", options: [], answer: "11" }
 ],
        
        // PAPER 2 (Example Placeholder - Replace with real data)
    
        2: [
  {
    "section": "Physics",
    "content": "If the velocity of light c, universal gravitational constant G and planck's constant h are chosen as fundamental quantities. The dimensions of mass in the new system is:",
    "options": [
      "[h^(1/2)c^(1/2)G^1]",
      "h^1 c^1 G^-1",
      "[h^-(1/2)c^(1/2)G^(1/2)]",
      "[h^(1/2)c^(1/2)G^-(1/2)]"
    ],
    "answer": "[h^(1/2)c^(1/2)G^-(1/2)]"
  },
  {
    "section": "Physics",
    "content": "For a train engine moving with speed of 20 ms⁻¹, the driver must apply brakes at a distance of 500 m before the station for the train to come to rest at the station. If the brakes were applied at half of this distance, the train engine would cross the station with speed ___ ms⁻¹. The value of ___ is (Assuming same retardation is produced by brakes)",
    "options": [],
    "answer": "14.14"
  },
  {
    "section": "Physics",
    "content": "As shown in the figure a block of mass 10 kg lying on a horizontal surface is pulled by a force F acting at an angle 30° with horizontal. For μs = 0.25 the block will just start to move for the value of F: [Given g = 10 m·s⁻²]<br><div class='flex justify-center my-4'><img src='images/q3.png' alt='Physics Question 3'></div>",
    "options": [
      "33.3 N",
      "25.2 N",
      "20 N",
      "35.7 N"
    ],
    "answer": "25.2 N"
  },
  {
    "section": "Physics",
    "content": "A block is fastened to a horizontal spring. The block is pulled to a distance x = 10 cm from its equilibrium position (at x = 0) on a frictionless surface from rest. The energy of the block at x = 5 cm is 0.25 J. The spring constant of the spring is ___ N m⁻¹.",
    "options": [],
    "answer": "66.67"
  },
  {
    "section": "Physics",
    "content": "A force F = (5 + 3y²) acts on a particle in the y-direction, where F is in newton and y is in meter. The work done by the force during a displacement from y = 2 m to y = 5 m is ___ J.",
    "options": [],
    "answer": "132"
  },
  {
    "section": "Physics",
    "content": "Figures (a), (b), (c) and (d) show variation of force with time. The impulse is highest in figure.<br><div class='flex justify-center my-4'><img src='images/q6.png' alt='Physics Question 6'><img src='images/a601.png' alt='Physics Question 6'></div>",
    "options": [
      "Fig (c)",
      "Fig (b)",
      "Fig (a)",
      "Fig (d)"
    ],
    "answer": "Fig (b)"
  },
  {
    "section": "Physics",
    "content": "Moment of inertia of a disc of mass M and radius 'R' about any of its diameter is MR²/4. The moment of inertia of this disc about an axis normal to the disc and passing through a point on its edge will be, (x/2)MR². The value of x is ___.",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Physics",
    "content": "The escape velocities of two planets A and B are in the ratio 1:2. If the ratio of their radii respectively is 1:3, then the ratio of acceleration due to gravity of planet A to the acceleration of gravity of planet B will be:",
    "options": [
      "4/3",
      "3/2",
      "2/3",
      "3/4"
    ],
    "answer": "3/4"
  },
  {
    "section": "Physics",
    "content": "For a body projected at an angle with the horizontal from the ground, choose the correct statement.",
    "options": [
      "Gravitational potential energy is maximum at the highest point.",
      "The horizontal component of velocity is zero at highest point.",
      "The vertical component of momentum is maximum at the highest point.",
      "The kinetic energy (K.E.) is zero at the highest point of projectile motion."
    ],
    "answer": "Gravitational potential energy is maximum at the highest point."
  },
  {
    "section": "Physics",
    "content": "The Young's modulus of a steel wire of length 6 m and cross-sectional area 3 mm², is 2 x 10¹¹ N/m². The wire is suspended from its support on a given planet. A block of mass 4 kg is attached to the free end of the wire. The acceleration due to gravity on the planet is 1/4 of its value on the earth. The elongation of wire is (Take g on the earth = 10 m/s²):",
    "options": [
      "1 mm",
      "0.1 mm",
      "1 cm",
      "0.1 cm"
    ],
    "answer": "0.1 mm"
  },
  {
    "section": "Physics",
    "content": "The surface of water in a water tank of cross section area 750 cm² on the top of a house is h m above the tap level. The speed of water coming out through the tap of cross section area 500 mm² is 30 cm s⁻¹. At that instant, dh/dt is x × 10⁻³ ms⁻¹. The value of x will be ___.",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Physics",
    "content": "For three low density gases A, B, C pressure versus temperature graphs are plotted while keeping them at constant volume, as shown in the figure. The temperature corresponding to the point K is:<br><div class='flex justify-center my-4'><img src='images/q12.png' alt='Physics Question 12'></div>",
    "options": [
      "-273°C",
      "-100°C",
      "-373°C",
      "-40°C"
    ],
    "answer": "-273°C"
  },
  {
    "section": "Physics",
    "content": "A Carnot engine operating between two reservoirs has efficiency 1/3. When the temperature of cold reservoir raised by x, its efficiency decreases to 1/6. The value of x, if the temperature of hot reservoir is 99°C, will be ___.",
    "options": [
      "16.5 K",
      "33 K",
      "66 K",
      "62 K"
    ],
    "answer": "62 K"
  },
  {
    "section": "Physics",
    "content": "Choose the correct length (L) versus square of time period (T²) graph for a simple pendulum executing simple harmonic motion.<br><div class='flex justify-center my-4'><img src='images/q14.png' alt='Physics Question 14'></div>",
    "options": [
      "images/q14_opt1.png",
      "images/q14_opt2.png",
      "images/q14_opt3.png",
      "images/q14_opt4.png"
    ],
    "answer": "images/q14_opt3.png"
  },
  {
    "section": "Physics",
    "content": "A cubical volume is bounded by the surfaces x=0, x=a, y=0, y=a, z=0, z=a. The electric field in the region is given by E = E₀xî. Where E₀ = 4×10⁴ NC⁻¹m⁻¹. If a = 2 cm, the charge contained in the cubical volume is Q × 10⁻¹⁴ C. The value of Q is ___. (Take ε₀ = 9×10⁻¹² C²N⁻¹m⁻²)",
    "options": [],
    "answer": "288"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: One is labelled as Assertion A and the other is labelled as Reason R.\nAssertion A: Two metallic spheres are charged to the same potential. One of them is hollow and another is solid, and both have the same radii. Solid sphere will have lower charge than the hollow one.\nReason R: Capacitance of metallic spheres depend on the radii of spheres.\nIn the light of the above statements, choose the correct answer from the options given below.",
    "options": [
      "A is false but R is true",
      "Both A and R are true and R is the correct explanation of A",
      "A is true but R is false",
      "Both A and R are true but R is not the correct explanation of A"
    ],
    "answer": "A is false but R is true"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: One is labelled as Assertion A and the other is labelled as Reason R.\nAssertion A: For measuring the potential difference across a resistance of 600 Ω, the voltmeter with resistance 1000 Ω will be preferred over voltmeter with resistance 4000 Ω.\nReason R: Voltmeter with higher resistance will draw smaller current than voltmeter with lower resistance.\nIn the light of the above statements, choose the most appropriate answer from the options given below.",
    "options": [
      "A is not correct but R is correct",
      "Both A and R are correct and R is the correct explanation of A",
      "Both A and R are correct but R is not the correct explanation of A",
      "A is correct but R is not correct"
    ],
    "answer": "A is not correct but R is correct"
  },
  {
    "section": "Physics",
    "content": "Equivalent resistance between the adjacent corners of a regular n-sided polygon of uniform wire of resistance R would be :",
    "options": [
      "(n-1)R / n²",
      "(n-1)R / (2n-1)",
      "n²R / (n-1)",
      "(n-1)R / n"
    ],
    "answer": "(n-1)R / n²"
  },
  {
    "section": "Physics",
    "content": "In the given circuit the value of |(I₁ + I₃) / I₂| is:<br><div class='flex justify-center my-4'><img src='images/q19.png' alt='Physics Question 19'></div>",
    "options": [],
    "answer": "9"
  },
  {
    "section": "Physics",
    "content": "A coil is placed in magnetic field such that plane of coil is perpendicular to the direction of magnetic field. The magnetic flux through a coil can be changed:\nA. By changing the magnitude of the magnetic field within the coil.\nB. By changing the area of coil within the magnetic field.\nC. By changing the angle between the direction of magnetic field and the plane of the coil.\nD. By reversing the magnetic field direction abruptly without changing its magnitude.\nChoose the most appropriate answer from the options given below:",
    "options": [
      "A and B only",
      "A, B and C only",
      "A, B and D only",
      "A and C only"
    ],
    "answer": "A, B, C and D"
  },
  {
    "section": "Physics",
    "content": "As shown in the figure, a long straight conductor with semicircular arc of radius (π/10) m is carrying current I = 3A. The magnitude of the magnetic field at the center O of the arc is: (The permeability of the vacuum = 4π × 10⁻⁷ NA⁻²)<br><div class='flex justify-center my-4'><img src='images/q21.png' alt='Physics Question 21'></div>",
    "options": [
      "6 μT",
      "1 μT",
      "4 μT",
      "3 μT"
    ],
    "answer": "3 μT"
  },
  {
    "section": "Physics",
    "content": "A square shaped coil of area 70 cm² having 600 turns rotates in a magnetic field of 0.4 Wb m⁻², about an axis which is parallel to one of the side of the coil and perpendicular to the direction of field. If the coil completes 500 revolution in a minute, the instantaneous emf when the plane of the coil is inclined at 60° with the field, will be ___ V. (Take π = 22/7)",
    "options": [],
    "answer": "44"
  },
  {
    "section": "Physics",
    "content": "The ratio of average electric energy density and total average energy density of electromagnetic wave is:",
    "options": [
      "2",
      "1",
      "3",
      "1/2"
    ],
    "answer": "1/2"
  },
  {
    "section": "Physics",
    "content": "Two objects A and B are placed at 15 cm and 25 cm from the pole in front of a concave mirror having radius of curvature 40 cm. The distance between images formed by the mirror is:",
    "options": [
      "40 cm",
      "60 cm",
      "160 cm",
      "100 cm"
    ],
    "answer": "160 cm"
  },
  {
    "section": "Physics",
    "content": "As shown in the figure, in Young's double slit experiment, a thin plate of thickness t = 10 μm and refractive index μ = 1.2 is inserted infront of slit S₁. The experiment is conducted in air (μ = 1) and uses a monochromatic light of wavelength λ = 500 nm. Due to the insertion of the plate, central maxima is shifted by a distance of xβ₀. β₀ is the fringe-width before the insertion of the plate. The value of the x is ___.<br><div class='flex justify-center my-4'><img src='images/q25.png' alt='Physics Question 25'></div>",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Physics",
    "content": "The threshold frequency of metal is f₀. When the light of frequency 2f₀ is incident on the metal plate, the maximum velocity of photoelectron is v₁. When the frequency of incident radiation is increased to 5f₀, the maximum velocity of photoelectrons emitted is v₂. The ratio of v₁ to v₂ is:",
    "options": [
      "v₁/v₂ = 1/2",
      "v₁/v₂ = 1/8",
      "v₁/v₂ = 1/16",
      "v₁/v₂ = 1/4"
    ],
    "answer": "v₁/v₂ = 1/2"
  },
  {
    "section": "Physics",
    "content": "An electron of a hydrogen like atom, having Z = 4, jumps from 4th energy state to 2nd energy state. The energy released in this process, will be: (Given Rch = 13.6 eV)",
    "options": [
      "13.6 eV",
      "10.5 eV",
      "3.4 eV",
      "40.8 eV"
    ],
    "answer": "40.8 eV"
  },
  {
    "section": "Physics",
    "content": "Nucleus A having Z = 17 and equal number of protons and neutrons has 1.2 MeV binding energy per nucleon. Another nucleus B of Z = 12 has total 26 nucleons and 1.8 MeV binding energy per nucleons. The difference of binding energy of B and A will be ___ MeV.",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Physics",
    "content": "Choose the correct statement about Zener diode:",
    "options": [
      "It works as a voltage regulator in reverse bias and behaves like simple p-n junction diode in forward bias.",
      "It works as a voltage regulator in both forward and reverse bias.",
      "It works as a voltage regulator only in forward bias.",
      "It works as a voltage regulator in forward bias and behaves like simple p-n junction diode in reverse bias."
    ],
    "answer": "It works as a voltage regulator in reverse bias and behaves like simple p-n junction diode in forward bias."
  },
  {
    "section": "Physics",
    "content": "In an amplitude modulation, a modulating signal having amplitude of X V is superimposed with a carrier signal of amplitude Y V in first case. Then, in second case, the same modulating signal is superimposed with different carrier signal of amplitude 2Y V. The ratio of modulation index in the two cases respectively will be:",
    "options": [
      "1:2",
      "1:1",
      "2:1",
      "4:1"
    ],
    "answer": "2:1"
  },
  {
    "section": "Chemistry",
    "content": "The molality of a 10% (v/V) solution of di-bromine solution in CCl₄ (carbon tetrachloride) is x × 10⁻² M. (Nearest integer) [Given: molar mass of Br₂ = 160g mol⁻¹, atomic mass of C = 12g mol⁻¹, atomic mass of Cl = 35.5 g mol⁻¹, density of dibromine = 3.2 g cm⁻³, density of CCl₄ = 1.6g cm⁻³]",
    "options": [],
    "answer": "139"
  },
  {
    "section": "Chemistry",
    "content": "Which one of the following sets of ions represents a collection of isoelectronic species? (Given: Atomic Number: F:9, Cl:17, Na=11, Mg=12, Al=13, K=19, Ca=20, Sc=21)",
    "options": [
      "(Li⁺, Na⁺, Mg²⁺, Ca²⁺)",
      "(Ba²⁺, Sr²⁺, K⁺, Ca²⁺)",
      "(N³⁻, O²⁻, F⁻, S²⁻)",
      "(K⁺, Cl⁻, Ca²⁺, Sc³⁺)"
    ],
    "answer": "(K⁺, Cl⁻, Ca²⁺, Sc³⁺)"
  },
  {
    "section": "Chemistry",
    "content": "For electron gain enthalpies of the elements denoted as ΔegH, the incorrect option is:",
    "options": [
      "ΔegH(Cl) < ΔegH(F)",
      "ΔegH(Se) < ΔegH(S)",
      "ΔegH(I) < ΔegH(At)",
      "ΔegH(Te) < ΔegH(Po)"
    ],
    "answer": "ΔegH(I) < ΔegH(At)"
  },
  {
    "section": "Chemistry",
    "content": "0.3 g of ethane undergoes combustion at 27°C in a bomb calorimeter. The temperature of calorimeter system (including the water) is found to rise by 0.5°C. The heat evolved during combustion of ethane at constant pressure is ___ kJ mol⁻¹. (Nearest integer) [Given: The heat capacity of the calorimeter system is 20 kJ K⁻¹, R = 8.3 JK⁻¹mol⁻¹. Assume ideal gas behaviour. Atomic mass of C and H are 12 and 1 g mol⁻¹ respectively]",
    "options": [],
    "answer": "-1006"
  },
  {
    "section": "Chemistry",
    "content": "The effect of addition of helium gas to the following reaction in equilibrium state at constant volume, is: PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)",
    "options": [
      "the equilibrium will shift in the forward direction and more of Cl₂ and PCl₃ gases will be produced.",
      "the equilibrium will go backward due to suppression of dissociation of PCl₅.",
      "helium will deactivate PCl₅ and reaction will stop.",
      "addition of helium will not affect the equilibrium."
    ],
    "answer": "addition of helium will not affect the equilibrium."
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).\nAssertion (A): An aqueous solution of KOH when for volumetric analysis, its concentration should be checked before the use.\nReason (R): On aging, KOH solution absorbs atmospheric CO₂.\nIn the light of the above statements, choose the correct answer from the options given below.",
    "options": [
      "(A) is not correct but (R) is correct",
      "Both (A) and (R) are correct but (R) is not the correct explanation of (A)",
      "Both (A) and (R) are correct and (R) is the correct explanation of (A)",
      "(A) is correct but (R) is not correct"
    ],
    "answer": "Both (A) and (R) are correct and (R) is the correct explanation of (A)"
  },
  {
    "section": "Chemistry",
    "content": "O-O bond length in H₂O₂ is X than the O-O bond length in F₂O₂. The O-H bond length in H₂O₂ is Y than that of the O-F bond in F₂O₂. Choose the correct option for X and Y from the given below.",
    "options": [
      "X - shorter, Y - shorter",
      "X - shorter, Y - longer",
      "X - longer, Y - longer",
      "X - longer, Y - shorter"
    ],
    "answer": "X - longer, Y - shorter"
  },
  {
    "section": "Chemistry",
    "content": "The starting material for convenient preparation of deuterated hydrogen peroxide (D₂O₂) in laboratory is:",
    "options": [
      "K₂S₂O₈",
      "2-ethylanthraquinol",
      "BaO₂",
      "BaO"
    ],
    "answer": "K₂S₂O₈"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).\nAssertion (A): Gypsum is used for making fireproof wall boards.\nReason (R): Gypsum is unstable at high temperatures.\nIn the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "Both (A) and (R) are correct but (R) is not the correct explanation of (A).",
      "(A) is correct but (R) is not correct.",
      "(A) is not correct but (R) is correct.",
      "Both (A) and (R) are correct and (R) is the correct explanation of (A)."
    ],
    "answer": "Both (A) and (R) are correct and (R) is the correct explanation of (A)."
  },
  {
    "section": "Chemistry",
    "content": "The correct order of bond enthalpy (kJ mol⁻¹) is:",
    "options": [
      "Si-Si > C-C > Sn-Sn > Ge-Ge",
      "Si-Si > C-C > Ge-Ge > Sn-Sn",
      "C-C > Si-Si > Sn-Sn > Ge-Ge",
      "C-C > Si-Si > Ge-Ge > Sn-Sn"
    ],
    "answer": "C-C > Si-Si > Ge-Ge > Sn-Sn"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements:\nStatement I: Sulphanilic acid gives esterification test for carboxyl group.\nStatement II: Sulphanilic acid gives red colour in Lassigne's test for extra element detection.\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    "options": [
      "Statement I is correct but Statement II is incorrect.",
      "Both Statement I and Statement II are incorrect",
      "Both Statement I and Statement II are correct",
      "Statement I is incorrect but Statement II is correct."
    ],
    "answer": "Both Statement I and Statement II are incorrect"
  },
  {
    "section": "Chemistry",
    "content": "Testosterone, which is a steroidal hormone, has the following structure. The total number of asymmetric carbon atom/s in testosterone is ___.<br><div class='flex justify-center my-4'><img src='images/q42.png' alt='Chemistry Question 42'></div>",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Chemistry",
    "content": "For the reaction shown, 'X' is:<br><div class='flex justify-center my-4'><img src='images/q43.png' alt='Chemistry Question 43'><br><img src='images/a44.png' alt='Physics Question 6'></div>",
    "options": [
      "images/q43_opt1.png",
      "images/q43_opt2.png",
      "images/q43_opt3.png",
      "images/q43_opt4.png"
    ],
    "answer": "images/q43_opt3.png"
  },
  {
    "section": "Chemistry",
    "content": "The industrial activity held least responsible for global warming is:",
    "options": [
      "manufacturing of cement",
      "steel manufacturing",
      "Electricity generation in thermal power plants.",
      "Industrial production of urea"
    ],
    "answer": "Industrial production of urea"
  },
  {
    "section": "Chemistry",
    "content": "A metal M crystallizes into two lattices:- face centred cubic (fcc) and body centred cubic (bcc) with unit cell edge length of 2.0 and 2.5 Å respectively. The ratio of densities of lattices fcc to bcc for the metal M is ___ (Nearest integer).",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "content": "20% of acetic acid is dissociated when its 5 g is added to 500 mL of water. The depression in freezing point of such water is ___ × 10⁻³ °C. Atomic mass of C, H and O are 12, 1 and 16 a.m.u. respectively. [Given: Molal depression constant and density of water are 1.86 K kg mol⁻¹ and 1 g cm⁻³ respectively.]",
    "options": [],
    "answer": "372"
  },
  {
    "section": "Chemistry",
    "content": "1×10⁻⁵ M AgNO₃ is added to 1 L of saturated solution of AgBr. The conductivity of this solution at 298 K is ___ × 10⁻⁸ S m⁻¹. [Given: Ksp(AgBr) = 4.9×10⁻¹³ at 298 K, λ°(Ag⁺) = 6×10⁻³ Sm²mol⁻¹, λ°(Br⁻) = 8×10⁻³ Sm²mol⁻¹, λ°(NO₃⁻) = 7×10⁻³ Sm²mol⁻¹]",
    "options": [],
    "answer": "13"
  },
  {
    "section": "Chemistry",
    "content": "The graph which represents the following reaction is: (C₆H₅)₃C-Cl --(OH⁻/Pyridine)--> (C₆H₅)₃C-OH",
    "options": [
      "images/q48_opt1.png",
      "images/q48_opt2.png",
      "images/q48_opt3.png",
      "images/q48_opt4.png"
    ],
    "answer": "images/q48_opt1.png"
  },
  {
    "section": "Chemistry",
    "content": "A → B. The above reaction is of zero order. Half life of this reaction is 50 min. The time taken for the concentration of A to reduce to one-fourth of its initial value is ___ min. (Nearest integer)",
    "options": [],
    "answer": "75"
  },
  {
    "section": "Chemistry",
    "content": "In figure, a straight line is given for Freundrich Adsorption (y = 3x + 2.505). The value of 1/n and log K are respectively:<br><div class='flex justify-center my-4'><img src='images/q50.png' alt='Chemistry Question 50'></div>",
    "options": [
      "0.3 and log 2.505",
      "0.3 and 0.7033",
      "3 and 2.505",
      "3 and 0.7033"
    ],
    "answer": "3 and 2.505"
  },
  {
    "section": "Chemistry",
    "content": "Among following compounds, the number of those present in copper matte is ___. A. CuCO₃, B. Cu₂S, C. Cu₂O, D. FeO",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).\nAssertion (A): Cu²⁺ in water is more stable than Cu⁺.\nReason (R): Enthalpy of hydration for Cu²⁺ is much less than that of Cu⁺.\nIn the light of the above statements, choose the correct answer from the options given below :",
    "options": [
      "Both (A) and (R) are correct and (R) is the correct explanation of (A).",
      "(A) is correct but (R) is not correct.",
      "(A) is not correct but (R) is correct.",
      "Both (A) and (R) are correct but (R) is not the correct explanation of (A)."
    ],
    "answer": "(A) is correct but (R) is not correct."
  },
  {
    "section": "Chemistry",
    "content": "Which element is not present in Nessler's reagent?",
    "options": [
      "Mercury",
      "Potassium",
      "Iodine",
      "Oxygen"
    ],
    "answer": "Oxygen"
  },
  {
    "section": "Chemistry",
    "content": "The complex cation which has two isomers is:",
    "options": [
      "[Co(H₂O)₆]³⁺",
      "[Co(NH₃)₅Cl]²⁺",
      "[Co(NH₃)₅NO₂]²⁺",
      "[Co(NH₃)₅Cl]⁺"
    ],
    "answer": "[Co(NH₃)₅NO₂]²⁺"
  },
  {
    "section": "Chemistry",
    "content": "The spin only magnetic moment of [Mn(H₂O)₆]²⁺ complexes is ___ B.M. (Nearest integer) (Given atomic number of Mn = 25)",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Chemistry",
    "content": "The structures of major products A, B and C in the following reaction are sequence:<br><div class='flex justify-center my-4'><img src='images/q56.png' alt='Chemistry Question 56'><br><img src='images/a56.png' alt='Chemistry Question 56'></div>",
    "options": [
      "images/q56_opt1.png",
      "images/q56_opt2.png",
      "images/q56_opt3.png",
      "images/q56_opt4.png"
    ],
    "answer": "images/q56_opt2.png"
  },
  {
    "section": "Chemistry",
    "content": "In a reaction, reagents 'X' and 'Y' respectively are:<br><div class='flex justify-center my-4'><img src='images/q57.png' alt='Chemistry Question 57'></div>",
    "options": [
      "(CH₃CO)₂O/H⁺ and CH₃OH/H⁺, Δ",
      "(CH₃CO)₂O/H⁺ and (CH₃CO)₂O/H⁺",
      "CH₃OH/H⁺, Δ and CH₃OH/H⁺, Δ",
      "CH₃OH/H⁺, Δ and (CH₃CO)₂O/H⁺"
    ],
    "answer": "(CH₃CO)₂O/H⁺ and CH₃OH/H⁺, Δ"
  },
  {
    "section": "Chemistry",
    "content": "Among the following, the number of tranquilizer/s is/are ___. A. Chloriazepoxide, B. Veronal, C. Valium, D. Salvarsan",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "content": "All structures given below are of vitamin C. Most stable of them is::<br><div class='flex justify-center my-4'><img src='images/q59.png' alt='Chemistry Question 57'></div>",
    "options": [
      "images/q59_opt1.png",
      "images/q59_opt2.png",
      "images/q59_opt3.png",
      "images/q59_opt4.png"
    ],
    "answer": "images/q59_opt1.png"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R).\nAssertion (A): α-halocarboxylic acid on reaction with dil. NH₃ gives good yield of α-amino carboxylic acid whereas the yield of amines is very low when prepared from alkyl halides.\nReason (R): Amino acids exist in zwitter ion form in aqueous medium.\nIn the light of the above statements, choose the correct answer from the options given below :",
    "options": [
      "Both (A) and (R) are correct and (R) is the correct explanation of (A).",
      "Both (A) and (R) are correct but (R) is not the correct explanation of (A).",
      "(A) is correct but (R) is not correct.",
      "(A) is not correct but (R) is correct."
    ],
    "answer": "Both (A) and (R) are correct but (R) is not the correct explanation of (A)."
  },
  {
    "section": "Mathematics",
    "content": "The number of integral values of k, for which one root of the equation 2x² - 8x + k = 0 lies in the interval (1, 2) and its other root lies in the interval (2, 3), is:",
    "options": [
      "2",
      "0",
      "1",
      "3"
    ],
    "answer": "1"
  },
  {
    "section": "Mathematics",
    "content": "Let a, b be two real numbers such that ab < 0. If the complex number (1+ai)/(b+i) is of unit modulus and a+ib lies on the circle |z-1| = |2z|, then a possible value of (1+[a])/(4b), where [t] is greatest integer function, is:",
    "options": [
      "0",
      "-1",
      "1",
      "1/2"
    ],
    "answer": "-1"
  },
  {
    "section": "Mathematics",
    "content": "Number of integral solutions to the equation x + y + z = 21, where x ≥ 1, y ≥ 3, z ≥ 4, is equal to ___.",
    "options": [],
    "answer": "105"
  },
  {
    "section": "Mathematics",
    "content": "The total number of six digit numbers, formed using the digits 4, 5, 9 only and divisible by 6, is ___.",
    "options": [],
    "answer": "81"
  },
  {
    "section": "Mathematics",
    "content": "The sum Σ (from n=1 to ∞) of (2n² + 3n + 4) / (2n)! is equal to:",
    "options": [
      "11e/2 + 7/(2e)",
      "13e/4 + 5/(4e) - 4",
      "11e/2 + 7/(2e) - 4",
      "13e/4 + 5/(4e)"
    ],
    "answer": "13e/4 + 5/(4e)"
  },
  {
    "section": "Mathematics",
    "content": "The sum of the common terms of the following three arithmetic progressions. 3, 7, 11, 15, ..., 399, 2, 5, 8, 11, ..., 359 and 2, 7, 12, 17, ..., 197, is equal to ___.",
    "options": [],
    "answer": "321"
  },
  {
    "section": "Mathematics",
    "content": "If the term without x in the expansion of (x²/³ + α/x³)¹² is 7315, then |α| is equal to ___.",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Mathematics",
    "content": "Let the sixth term in the binomial expansion of (√(2^(log₂(10-3^x))) + ⁵√(2^((x-2)log₂3)))^m, in the increasing powers of 2^((x-2)log₂3), be 21. If the binomial coefficients of the second, third and fourth terms in the expansion are respectively the first, third and fifth terms of an A.P., then the sum of the squares of all possible values of x is ___.",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "content": "If the y-intercept of a focal chord of the parabola y² = 8x + 4y + 4 is 3, then the length of this chord is equal to ___.",
    "options": [],
    "answer": "22"
  },
  {
    "section": "Mathematics",
    "content": "The line x = 8 is the directrix of the ellipse E: x²/a² + y²/b² = 1 with the corresponding focus (2,0). If the tangent to E at the point P in the first quadrant passes through the point (0, 4√3) and intersects the x-axis at Q, then (3PQ)² is equal to ___.",
    "options": [],
    "answer": "39"
  },
  {
    "section": "Mathematics",
    "content": "Let P(x₀, y₀) be the point on the hyperbola 3x² - 4y² = 36, which is nearest to the line 3x + 2y = 1. Then √2(y₀ - x₀) is equal to:",
    "options": [
      "-3",
      "9",
      "-9",
      "3"
    ],
    "answer": "-9"
  },
  {
    "section": "Mathematics",
    "content": "Which of the following statements is a tautology?",
    "options": [
      "p → (p ∧ (p → q))",
      "(p ∧ q) → (¬p → q)",
      "(p ∧ (p → q)) → ¬q",
      "p ∨ (p ∧ q)"
    ],
    "answer": "(p ∧ q) → (¬p → q)"
  },
  {
    "section": "Mathematics",
    "content": "Let 9 = x₁ < x₂ < ... < x₇ be in an A.P. with common difference d. If the standard deviation of x₁, x₂, ..., x₇ is 4 and the mean is x̄, then x̄ + x₆ is equal to:",
    "options": [
      "18(1 + 1/√3)",
      "34",
      "2(9 + 8/√7)",
      "25"
    ],
    "answer": "34"
  },
  {
    "section": "Mathematics",
    "content": "Let P(S) denote the power set of S = {1, 2, 3, ..., 10}. Define the relations R₁ and R₂ on P(S) as AR₁B if (A ∩ Bᶜ) ∪ (B ∩ Aᶜ) = ∅ and AR₂B if A ∪ Bᶜ = B ∪ Aᶜ, ∀ A, B ∈ P(S). Then:",
    "options": [
      "both R₁ and R₂ are equivalence relations",
      "only R₁ is an equivalence relation",
      "only R₂ is an equivalence relation",
      "both R₁ and R₂ are not equivalence relations"
    ],
    "answer": "both R₁ and R₂ are equivalence relations"
  },
  {
    "section": "Mathematics",
    "content": "If A = (1/2) * [[1, √3], [-√3, 1]], then:",
    "options": [
      "A³⁰ - A²⁵ = 2I",
      "A³⁰ + A²⁵ + A = I",
      "A³⁰ + A²⁵ - A = I",
      "A³⁰ = A²⁵"
    ],
    "answer": "A³⁰ + A²⁵ - A = I"
  },
  {
    "section": "Mathematics",
    "content": "For the system of linear equations αx + y + z = 1, x + αy + z = 1, x + y + αz = β, which one of the following statements is NOT correct?",
    "options": [
      "It has infinitely many solutions if α = 2 and β = -1",
      "It has no solution if α = -2 and β = 1",
      "x + y + z = 3/4 if α = 2 and β = 1",
      "It has infinitely many solutions if α = 1 and β = 1"
    ],
    "answer": "It has infinitely many solutions if α = 2 and β = -1"
  },
  {
    "section": "Mathematics",
    "content": "Let S = {x ∈ R : 0 < x < 1 and 2 tan⁻¹((1-x)/(1+x)) = cos⁻¹((1-x²)/(1+x²))}. If n(S) denotes the number of elements in S then:",
    "options": [
      "n(S) = 2 and only one element in S is less then 1/2",
      "n(S) = 1 and the element in S is more than 1/2",
      "n(S) = 1 and the element in S is less then 1/2",
      "n(S) = 0"
    ],
    "answer": "n(S) = 1 and the element in S is less then 1/2"
  },
  {
    "section": "Mathematics",
    "content": "Let f: R - {0, 1} → R be a function such that f(x) + f(1/(1-x)) = 1+x. Then f(2) is equal to:",
    "options": [
      "9/2",
      "9/4",
      "7/4",
      "7/3"
    ],
    "answer": "9/4"
  },
  {
    "section": "Mathematics",
    "content": "If y(x) = x^x, x > 0, then y''(2) - 2y'(2) is equal to:",
    "options": [
      "8 logₑ2 - 2",
      "4 logₑ2 + 2",
      "4(logₑ2)² - 2",
      "4(logₑ2)² + 2"
    ],
    "answer": "4(logₑ2)² + 2"
  },
  {
    "section": "Mathematics",
    "content": "The sum of the absolute maximum and minimum values of the function f(x) = |x² - 5x + 6| - 3x + 2 in the interval [-1, 3] is equal to:",
    "options": [
      "10",
      "12",
      "13",
      "24"
    ],
    "answer": "13"
  },
  {
    "section": "Mathematics",
    "content": "The value of the integral ∫ (from -π/4 to π/4) of (x + π/4) / (2 - cos(2x)) dx is:",
    "options": [
      "π² / 6",
      "π² / (12√3)",
      "π² / (3√3)",
      "π² / (6√3)"
    ],
    "answer": "π² / (6√3)"
  },
  {
    "section": "Mathematics",
    "content": "If ∫ (from 0 to π) of (5^cos(x) * (1 + cos(x)cos(3x) + cos²(x) + cos³(x)cos(3x))) / (1 + 5^cos(x)) dx = kπ / 16, then k is equal to ___.",
    "options": [],
    "answer": "13"
  },
  {
    "section": "Mathematics",
    "content": "The area of the region given by {(x, y) : xy ≤ 8, 1 ≤ y ≤ x²} is:",
    "options": [
      "8 logₑ2 - 13/3",
      "16 logₑ2 - 14/3",
      "8 logₑ2 + 7/6",
      "16 logₑ2 + 7/3"
    ],
    "answer": "16 logₑ2 - 14/3"
  },
  {
    "section": "Mathematics",
    "content": "Let αx = exp(x^β y^γ) be the solution of the differential equation 2x²y dy - (1 - xy²) dx = 0, x > 0, y(2) = √(logₑ2). Then α + β - γ equals:",
    "options": [
      "1",
      "-1",
      "0",
      "3"
    ],
    "answer": "3"
  },
  {
    "section": "Mathematics",
    "content": "Let a = 5i - j - 3k and b = i + 3j + 5k be two vectors. Then which one of the following statements is TRUE?",
    "options": [
      "Projection of a on b is -13/√35 and the direction of the projection vector is opposite to the direction of b.",
      "Projection of a on b is -17/√35 and the direction of the projection vector is opposite to the direction of b.",
      "Projection of a on b is 17/√35 and the direction of the projection vector is opposite to the direction of b.",
      "Projection of a on b is 13/√35 and the direction of the projection vector is opposite to the direction of a."
    ],
    "answer": "Projection of a on b is -13/√35 and the direction of the projection vector is opposite to the direction of b."
  },
  {
    "section": "Mathematics",
    "content": "Let a = 2i - 7j + 5k, b = i + k and c = i + 2j - 3k be three given vectors. If r is a vector such that r × a = c × a and r · b = 0, then |r| is equal to:",
    "options": [
      "(11/7)√2",
      "11/7",
      "(11/5)√2",
      "√914 / 7"
    ],
    "answer": "(11/7)√2"
  },
  {
    "section": "Mathematics",
    "content": "Let the plane P pass through the intersection of the planes 2x + 3y - z = 2 and x + 2y + 3z = 6, and be perpendicular to the plane 2x + y - z + 1 = 0. If d is the distance of P from the point (-7, 1, 1), then d² is equal to:",
    "options": [
      "250/83",
      "15/53",
      "25/83",
      "250/82"
    ],
    "answer": "250/83"
  },
  {
    "section": "Mathematics",
    "content": "Let αx + βy + γz = 1 be the equation of a plane passing through the point (3, -2, 5) and perpendicular to the line joining the points (1, 2, 3) and (-2, 3, 5). Then the value of |αβγ| is equal to ___.",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Mathematics",
    "content": "The point of intersection C of the plane 8x + y + 2z = 0 and the line joining the points A(-3, -6, 1) and B(2, 4, -3) divides the line segment AB internally in the ratio k:1. If a, b, c (a, b, c are coprime) are the direction ratios of the perpendicular from the point C on the line (1-x)/1 = (y+4)/2 = (z+2)/3, then |a + b + c| is equal to ___.",
    "options": [],
    "answer": "10"
  },
  {
    "section": "Mathematics",
    "content": "Two dice are thrown independently. Let A be the event that the number appeared on the 1st die is less than the number appeared on the 2nd die, B be the event that the number appeared on the 1st die is even and that on the second die is odd, and C be the event that the number appeared on the 1st die is odd and that on the 2nd is even. Then:",
    "options": [
      "The number of favourable cases of the event (A ∪ B) ∩ C is 6",
      "A and B are mutually exclusive",
      "The number of favourable cases of the events A, B and C are 15, 6 and 6 respectively",
      "B and C are independent"
    ],
    "answer": "The number of favourable cases of the event (A ∪ B) ∩ C is 6"
  }
        ],
        
  3:[
{
    "section": "Physics",
    "question_number": 1,
    "content": "Two resistance are given as \\(R_{1}=(10\\pm0.5)\\) and \\(R_{2}=(15\\pm0.5)\\) Ω. The percentage error in the measurement of equivalent resistance when they are connected in parallel is",
    "options": [
      "6.33",
      "2.33",
      "5.33",
      "4.33"
    ],
    "answer": "4.33"
  },
  {
    "section": "Physics",
    "question_number": 2,
    "content": "A particle is moving with constant speed in a circular path. When the particle turns by an angle 90°, the ratio of instantaneous velocity to its average velocity is π: \\(x\\sqrt{2}\\). The value of x will be",
    "options": [
      "2",
      "5",
      "1",
      "7"
    ],
    "answer": "2"
  },
  {
    "section": "Physics",
    "question_number": 3,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R.<br>Assertion A: When a body is projected at an angle 45°, its range is maximum.<br>Reason R: For maximum range, the value of sin 2θ should be equal to one.<br>In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "A is false but R is true",
      "A is true but R is false",
      "Both A and R are correct and R is the correct explanation of A",
      "Both A and R are correct but R is NOT the correct explanation of A"
    ],
    "answer": "Both A and R are correct and R is the correct explanation of A"
  },
  {
    "section": "Physics",
    "question_number": 4,
    "content": "A mass m is attached to two springs as shown in figure. The spring constants of two springs are \\(K_{1}\\) and \\(K_{2}\\). For the frictionless surface, the time period of oscillation of mass m is<br><div class='flex justify-center my-4'><img src='images/3/q4.png' alt='Physics Question 4'></div>",
    "options": [
      "2π \\( \\frac{K_{1}+K_{2}}{m} \\)",
      "\\(\\frac{1}{2\\pi}\\sqrt{\\frac{K_{1}\\cdot K_{2}}{m}}\\)",
      "\\(2\\pi\\sqrt{\\frac{m}{k_{1}\\cdot k_{2}}}\\)",
      "\\(\\frac{1}{2\\pi}\\sqrt{\\frac{k_{1}+k_{2}}{m}}\\)"
    ],
    "answer": "2π \\( \\frac{K_{1}+K_{2}}{m} \\)"
  },
  {
    "section": "Physics",
    "question_number": 5,
    "content": "A small block of mass 100 g is tied to a spring of spring constant 7.5 N \\(m^{-1}\\) and length 20 cm. The other end of spring is fixed at a particular point A. If the block moves in a circular path on a smooth horizontal surface with constant angular velocity 5 rad \\(s^{-1}\\) point A, then tension in the spring is<br><div class='flex justify-center my-4'><img src='images/3/q5.png' alt='Physics Question 5'></div>",
    "options": [
      "0.75 N",
      "0.25 N",
      "0.50 N",
      "1.5 N"
    ],
    "answer": "0.75 N"
  },
  {
    "section": "Physics",
    "question_number": 6,
    "content": "A planet has double the mass of the earth. Its average density is equal to that of the earth. An object weighing W on earth will weigh on that planet:",
    "options": [
      "\\(2^{\\frac{1}{4}}W\\)",
      "\\(2^{\\frac{1}{3}}W\\)",
      "2W",
      "\\(2^{\\frac{2}{3}}W\\)"
    ],
    "answer": "\\(2^{\\frac{1}{3}}W\\)"
  },
  {
    "section": "Physics",
    "question_number": 7,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R.<br>Assertion A: Earth has atmosphere whereas moon doesn't have any atmosphere.<br>Reason R: The escape velocity on moon is very small as compared to that on earth.<br>In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "Both A and R are correct but R is NOT the correct explanation of A",
      "A is false but R is true",
      "Both A and R are correct and R is the correct explanation of A",
      "A is true but R is false"
    ],
    "answer": "Both A and R are correct and R is the correct explanation of A"
  },
  {
    "section": "Physics",
    "question_number": 8,
    "content": "A small ball of mass M and density ρ is dropped in a viscous liquid of density \\(\\rho_{0}\\). After some time, the ball falls with a constant velocity. What is the viscous force on the ball?",
    "options": [
      "\\(F=Mg(1+\\frac{\\rho_{0}}{\\rho})\\)",
      "\\(F=Mg(1+\\frac{\\rho}{\\rho_{0}})\\)",
      "\\(F=Mg(1-\\frac{\\rho_{0}}{\\rho})\\)",
      "\\(F=Mg(1\\pm\\rho\\rho_{0})\\)"
    ],
    "answer": "\\(F=Mg(1-\\frac{\\rho_{0}}{\\rho})\\)"
  },
  {
    "section": "Physics",
    "question_number": 9,
    "content": "A source supplies heat to a system at the rate of 1000 W. If the system performs work at a rate of 200 W. The rate at which internal energy of the system increases is",
    "options": [
      "600 W",
      "800 W",
      "500 W",
      "1200 W"
    ],
    "answer": "800 W"
  },
  {
    "section": "Physics",
    "question_number": 10,
    "content": "The number of air molecules per \\(cm^{3}\\) is increased from \\(3\\times10^{19}\\) to \\(12\\times10^{19}\\). The ratio of collision frequency of air molecules before and after the increase in number respectively is:",
    "options": [
      "0.75",
      "1.25",
      "0.50",
      "0.25"
    ],
    "answer": "0.25"
  },
  {
    "section": "Physics",
    "question_number": 11,
    "content": "For a uniformly charged thin spherical shell, the electric potential V radially away from the centre O of shell can be graphically represented as<br><div class='flex justify-center my-4'><img src='images/3/q11.png' alt='Physics Question 11'></div>",
    "options": [
      "Graph 1",
      "Graph 2",
      "Graph 3",
      "Graph 4"
    ],
    "answer": "Graph 2"
  },
  {
    "section": "Physics",
    "question_number": 12,
    "content": "A long straight wire of circular cross-section (radius a) is carrying steady current I. The current I is uniformly distributed across this cross-section. The magnetic field is",
    "options": [
      "inversely proportional to r in the region \\(r<a\\) and uniform throughout in the region \\(r>a\\)",
      "directly proportional to r in the region \\(r<a\\) and inversely proportional to r in the region \\(r>a\\)",
      "Zero in the region \\(r<a\\) and inversely proportional to r in the region \\(r>a\\)",
      "uniform in the region \\(r<a\\) and inversely proportional to distance r from the axis, in the region \\(r>a\\)"
    ],
    "answer": "directly proportional to r in the region \\(r<a\\) and inversely proportional to r in the region \\(r>a\\)"
  },
  {
    "section": "Physics",
    "question_number": 13,
    "content": "The induced emf can be produced in a coil by<br>A. moving the coil with uniform speed inside uniform magnetic field<br>B. moving the coil with non uniform speed inside uniform magnetic field<br>C. rotating the coil inside the uniform magnetic field<br>D. changing the area of the coil inside the uniform magnetic field<br>Choose the correct answer from the options given below:",
    "options": [
      "B and C only",
      "A and C only",
      "C and D only",
      "B and D only"
    ],
    "answer": "C and D only"
  },
  {
    "section": "Physics",
    "question_number": 14,
    "content": "For the plane electromagnetic wave given by \\(E=E_{0}sin(\\omega t-kx)\\) and \\(B=B_{0}sin(\\omega t-kx)\\), the ratio of average electric energy density to average magnetic energy density is",
    "options": [
      "1/2",
      "2",
      "4",
      "1"
    ],
    "answer": "1"
  },
  {
    "section": "Physics",
    "question_number": 15,
    "content": "A monochromatic light wave with wavelength \\(\\lambda_{1}\\) and frequency \\(v_{1}\\) in air enters another medium. If the angle of incidence and angle of refraction at the interface are \\(45^{\\circ}\\) and \\(30^{\\circ}\\) respectively, then the wavelength \\(\\lambda_{2}\\) and frequency \\(v_{2}\\) of the refracted wave are:",
    "options": [
      "\\(\\lambda_{2}=\\sqrt{2}\\lambda_{1}, v_{2}=v_{1}\\)",
      "\\(\\lambda_{2}=\\lambda_{1}, v_{2}=\\frac{1}{\\sqrt{2}}v_{1}\\)",
      "\\(\\lambda_{2}=\\lambda_{1}, v_{2}=\\sqrt{2}v_{1}\\)",
      "\\(\\lambda_{2}=\\frac{1}{\\sqrt{2}}\\lambda_{1}, v_{2}=v_{1}\\)"
    ],
    "answer": "\\(\\lambda_{2}=\\frac{1}{\\sqrt{2}}\\lambda_{1}, v_{2}=v_{1}\\)"
  },
  {
    "section": "Physics",
    "question_number": 16,
    "content": "The kinetic energy of an electron, a particle and a proton are given as 4K, 2K and K respectively. The de-Broglie wavelength associated with electron (\\(\\lambda_{e}\\)), α-particle (\\(\\lambda_{\\alpha}\\)) and the proton (\\(\\lambda_{p}\\)) are as follows:",
    "options": [
      "\\(\\lambda_{\\alpha}=\\lambda_{p}>\\lambda_{e}\\)",
      "\\(\\lambda_{\\alpha}<\\lambda_{p}<\\lambda_{e}\\)",
      "\\(\\lambda_{\\alpha}=\\lambda_{p}<\\lambda_{e}\\)",
      "\\(\\lambda_{\\alpha}>\\lambda_{p}>\\lambda_{e}\\)"
    ],
    "answer": "\\(\\lambda_{\\alpha}<\\lambda_{p}<\\lambda_{e}\\)"
  },
  {
    "section": "Physics",
    "question_number": 17,
    "content": "The energy levels of an hydrogen atom are shown below. The transition corresponding to emission of shortest wavelength is<br><div class='flex justify-center my-4'><img src='images/3/q17.png' alt='Physics Question 17'></div>",
    "options": [
      "D",
      "A",
      "B",
      "C"
    ],
    "answer": "D"
  },
  {
    "section": "Physics",
    "question_number": 18,
    "content": "Name the logic gate equivalent to the diagram attached<br><div class='flex justify-center my-4'><img src='images/3/q18.png' alt='Physics Question 18'></div>",
    "options": [
      "NAND",
      "AND",
      "NOR",
      "OR"
    ],
    "answer": "NOR"
  },
  {
    "section": "Physics",
    "question_number": 19,
    "content": "The resistivity (ρ) of semiconductor varies with temperature. Which of the following curve represents the correct behaviour?",
    "options": [
      "Graph 1",
      "Graph 2",
      "Graph 3",
      "Graph 4"
    ],
    "answer": "Graph 3"
  },
  {
    "section": "Physics",
    "question_number": 20,
    "content": "By what percentage will the transmission range of a TV tower be affected when the height of the tower is increased by 21%?",
    "options": [
      "15%",
      "12%",
      "10%",
      "14%"
    ],
    "answer": "10%"
  },
  {
    "section": "Physics",
    "question_number": 21,
    "content": "The length of a metallic wire is increased by 20% and its area of cross-section is reduced by 4%. The percentage change in resistance of the metallic wire is",
    "options": [],
    "answer": "25"
  },
  {
    "section": "Physics",
    "question_number": 22,
    "content": "A particle of mass 10 g moves in a straight line with retardation 2x, where x is the displacement in SI units. Its loss of kinetic energy for above displacement is \\(\\frac{10}{x}^{-n}\\). The value of n will be",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Physics",
    "question_number": 23,
    "content": "Two identical solid spheres each of mass 2 kg and radii 10 cm are fixed at the ends of a light rod. The separation between the centres of the spheres is 40 cm. The moment of inertia of the system about an axis perpendicular to the rod passing through its middle point is ___ \\(\\times10^{-3}\\) kg m².",
    "options": [],
    "answer": "176"
  },
  {
    "section": "Physics",
    "question_number": 24,
    "content": "A steel rod has a radius of 20 mm and a length of 2.0 m. A force of 62.8 kN stretches it along its length. Young's modulus of steel is \\(2.0\\times10^{11}N\\) m². The longitudinal strain produced in the wire is ___ \\(\\times10^{-5}\\).",
    "options": [],
    "answer": "25"
  },
  {
    "section": "Physics",
    "question_number": 25,
    "content": "A person driving car at a constant speed of 15 m \\(s^{-1}\\) is approaching a vertical wall. The person notices a change of 40 Hz in the frequency of his car's horn upon reflection from the wall. The frequency of horn is ___ Hz. (Given: Speed of sound: 30 m \\(s^{-1}\\))",
    "options": [],
    "answer": "420"
  },
  {
    "section": "Physics",
    "question_number": 26,
    "content": "A parallel plate capacitor with plate area A and plate separation d is filled with a dielectric material of dielectric constant \\(K=4\\). The thickness of the dielectric material is x, where \\(x<d\\). Let \\(C_{1}\\) and \\(C_{2}\\) be the capacitance of the system for \\(x=\\frac{1}{3}d\\) and \\(x=\\frac{2d}{3}\\) respectively. If \\(C_{1}=2\\) µF, the value of \\(C_{2}\\) is<br><div class='flex justify-center my-4'><img src='images/3/q26.png' alt='Physics Question 26'></div>",
    "options": [
      "\\(2\\mu F\\)",
      "\\(4\\mu F\\)",
      "\\(3\\mu F\\)",
      "\\(5\\mu F\\)"
    ],
    "answer": "\\(3\\mu F\\)"
  },
  {
    "section": "Physics",
    "question_number": 27,
    "content": "Two identical circular wires of radius 20 cm and carrying current \\(\\sqrt{2}A\\) are placed in perpendicular planes as shown in figure. The net magnetic field at the centre of the circular wires is ___ \\(\\times10^{-8}T.\\) (Take \\(\\pi=3.14\\))<br><div class='flex justify-center my-4'><img src='images/3/q27.png' alt='Physics Question 27'></div>",
    "options": [],
    "answer": "628"
  },
  {
    "section": "Physics",
    "question_number": 28,
    "content": "An ideal transformer with purely resistive load operates at 12 kV on the primary side. It supplies electrical energy to a number of nearby houses at 120 V. The average rate of energy consumption in the houses served by the transformer is 60 kW. The value of resistive load (\\(R_{s}\\)) required in the secondary circuit will be ___ mΩ.",
    "options": [],
    "answer": "240"
  },
  {
    "section": "Physics",
    "question_number": 29,
    "content": "A pole is vertically submerged in swimming pool, such that it gives a length of shadow 2.15 m within water when sunlight is incident at an angle of \\(30^{\\circ}\\) with the surface of water. If swimming pool is filled to a height of 1.5 m, then the height of the pole above the water surface in centimeters is ___ (\\(n_{w}=\\frac{4}{3}\\))",
    "options": [],
    "answer": "50"
  },
  {
    "section": "Physics",
    "question_number": 30,
    "content": "The radius of fifth orbit of \\(Li^{++}\\) is ___ \\(\\times10^{-12}\\) m. Take: radius of hydrogen atom = 0.51 A",
    "options": [],
    "answer": "425"
  },
  {
    "section": "Chemistry",
    "question_number": 31,
    "content": "For a concentrated solution of a weak electrolyte (\\(K_{eq}\\)= equilibrium constant) \\(A_{2}B_{3}\\) of concentration 'C', the degree of dissociation 'a' is",
    "options": [
      "\\( (\\frac{K_{eq}}{C^{4}})^{\\frac{1}{5}} \\)",
      "\\( (\\frac{K_{eq}}{108C^{4}})^{\\frac{1}{5}} \\)",
      "\\( (\\frac{K_{eq}}{25C^{2}})^{\\frac{1}{5}} \\)",
      "\\( (\\frac{K_{eq}}{6C^{5}})^{\\frac{1}{5}} \\)"
    ],
    "answer": "\\( (\\frac{K_{eq}}{108C^{4}})^{\\frac{1}{5}} \\)"
  },
  {
    "section": "Chemistry",
    "question_number": 32,
    "content": "Which of the following options are correct for the reaction? \\(2Au{(CN)_{2}}^{-}(aq)+Zn(s)\\rightarrow2Au(s)+Zn(CN)_{4}^{2-}(aq)\\)<br>A. Redox reaction<br>B. Displacement reaction<br>C. Decomposition reaction<br>D. Combination reaction",
    "options": [
      "A only",
      "A and D only",
      "A and B only",
      "C and D only"
    ],
    "answer": "A and B only"
  },
  {
    "section": "Chemistry",
    "question_number": 33,
    "content": "Strong reducing and oxidizing agents among the following, respectively, are",
    "options": [
      "\\(Ce^{3+}\\) and \\(Ce^{4+}\\)",
      "\\(Ce^{4+}\\) and \\(Tb^{4+}\\)",
      "\\(Ce^{4+}\\) and \\(Eu^{2+}\\)",
      "\\(Eu^{2+}\\) and \\(Ce^{4+}\\)"
    ],
    "answer": "\\(Eu^{2+}\\) and \\(Ce^{4+}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 34,
    "content": "Given below are two statements, one is labelled as Assertion A and the other is labelled as Reason R.<br>Assertion A: Loss of electron from hydrogen atom results in nucleus of \\(\\sim1.5\\times10^{-3}\\) pm size.<br>Reason R: Proton \\(H^{+}\\) always exists in combined form.<br>In the light of the above statements, choose the most appropriate answer from the options given below:",
    "options": [
      "Both A and R are correct and R is the correct explanation of A",
      "A is correct but R is not correct",
      "A is not correct but R is correct",
      "Both A and R are correct but R is NOT the correct explanation of A"
    ],
    "answer": "Both A and R are correct but R is NOT the correct explanation of A"
  },
  {
    "section": "Chemistry",
    "question_number": 35,
    "content": "The setting time of Cement is increased by adding",
    "options": [
      "Clay",
      "Silica",
      "Gypsum",
      "Limestone"
    ],
    "answer": "Gypsum"
  },
  {
    "section": "Chemistry",
    "question_number": 36,
    "content": "Match List-I with List-II.<br>List-I (Element detected)<br>A Nitrogen<br>B Sulphur<br>C Phosphorus<br>D Halogen<br>List-II (Reagent used/Product formed)<br>I \\(Na_{2}[Fe(CN)_{5}NO]\\)<br>II \\(AgNO_{3}\\)<br>III \\(Fe_{4}[Fe(CN)_{6}]_{3}\\)<br>IV \\((NH_{4})_{2}MoO_{4}\\)",
    "options": [
      "A-III; B-I; C-IV; D-II",
      "A-II; B-IV; C-I; D-III",
      "A-IV; B-II; C-I; D-III",
      "A-II; B-I; C-IV; D-III"
    ],
    "answer": "A-III; B-I; C-IV; D-II"
  },
  {
    "section": "Chemistry",
    "question_number": 37,
    "content": "The possibility of photochemical smog formation is more at",
    "options": [
      "Marshy lands",
      "Industrial areas",
      "Himalayan villages in winter",
      "The places with healthy vegetation"
    ],
    "answer": "Industrial areas"
  },
  {
    "section": "Chemistry",
    "question_number": 38,
    "content": "A compound is formed by two elements X and Y. The element Y forms cubic close packed arrangement and those of element X occupy one third of the tetrahedral voids. What is the formula of the compound?",
    "options": [
      "\\(X_{2}Y_{3}\\)",
      "\\(X_{3}Y_{2}\\)",
      "\\(X_{3}Y\\)",
      "\\(XY_{3}\\)"
    ],
    "answer": "\\(X_{2}Y_{3}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 39,
    "content": "The standard electrode potential of \\(M^{+}/M\\) in aqueous solution does not depend on",
    "options": [
      "Hydration of a gaseous metal ion",
      "Sublimation of a solid metal",
      "Ionisation of a solid metal atom",
      "Ionisation of a gaseous metal atom"
    ],
    "answer": "Ionisation of a solid metal atom"
  },
  {
    "section": "Chemistry",
    "question_number": 40,
    "content": "Match List I with List II<br>LIST I (Enzymatic reaction)<br>A Sucrose -> Glucose and Fructose<br>B Glucose -> ethyl alcohol and \\(CO_{2}\\)<br>C Starch -> Maltose<br>D Proteins -> Amino acids<br>LIST II (Enzyme)<br>I Zymase<br>II Pepsin<br>III Invertase<br>IV Diastase",
    "options": [
      "A-I, B-II, C-IV, D-III",
      "A-III, B-I, C-IV, D-II",
      "A-III, B-I, C-II, D-IV",
      "A-I, B-IV, C-III, D-II"
    ],
    "answer": "A-III, B-I, C-IV, D-II"
  },
  {
    "section": "Chemistry",
    "question_number": 41,
    "content": "The difference between electron gain enthalpies will be maximum between :",
    "options": [
      "Ne and F",
      "Ar and F",
      "Ne and Cl",
      "Ar and Cl"
    ],
    "answer": "Ne and Cl"
  },
  {
    "section": "Chemistry",
    "question_number": 42,
    "content": "Match List I with List II<br>List I (Oxide)<br>A \\(N_{2}O_{4}\\)<br>B \\(NO_{2}\\)<br>C \\(N_{2}O_{5}\\)<br>D \\(N_{2}O\\)<br>List II (Type of bond)<br>I 1 N=O bond<br>II 1 N-O-N bond<br>III 1 N-N bond<br>IV 1 N=N/N bond",
    "options": [
      "A-III, B-I, C-II, D-IV",
      "A-II, B-IV, C-III, D-I",
      "A-III, B-I, C-IV, D-II",
      "A-II, B-I, C-III, D-IV"
    ],
    "answer": "A-III, B-I, C-II, D-IV"
  },
  {
    "section": "Chemistry",
    "question_number": 43,
    "content": "Match List-I with List-II.<br>List-I (Name of reaction)<br>A Hell-Volhard Zelinsky reaction<br>B Iodoform reaction<br>C Etard reaction<br>D Gatterman-Koch reaction<br>List-II (Reagent used)<br>I NaOH + \\(I_{2}\\)<br>II (i) \\(CrO_{2}Cl_{2}\\), \\(CS_{2}\\) (ii) \\(H_{2}O\\)<br>III (i) \\(Br_{2}/red\\) phosphorus (ii) \\(H_{2}O\\)<br>IV CO, HCl, anhyd. \\(AlCl_{3}\\)",
    "options": [
      "A-III; B-I; C-II; D-IV",
      "A-I; B-II; C-III; D-IV",
      "A-III; B-II; C-I; D-IV",
      "A-III; B-I; C-IV; D-II"
    ],
    "answer": "A-III; B-I; C-II; D-IV"
  },
  {
    "section": "Chemistry",
    "question_number": 44,
    "content": "Given below are two statements, one is labelled as Assertion A and the other is labelled as Reason R.<br>Assertion A: The spin only magnetic moment value for \\(Fe(CN)_{6}^{3-}\\) is 1.74 BM, whereas for \\([Fe(H_2O)_6]^{3+}\\) is 5.92 BM.<br>Reason R: In both complexes, Fe is present in +3 oxidation state.<br>In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "A is false but R is true",
      "A is true but R is false",
      "Both A and R are true but R is NOT the correct explanation of A",
      "Both A and R are true and R is the correct explanation of A"
    ],
    "answer": "Both A and R are true but R is NOT the correct explanation of A"
  },
  {
    "section": "Chemistry",
    "question_number": 45,
    "content": "For the reaction Acetone \\(RCH_{2}Br+I^{-}\\rightarrow RCH_{2}I+Br^{-}\\), The correct statement is",
    "options": [
      "\\(Br^{-}\\) can act as competing nucleophile.",
      "The reaction can occur in acetic acid also.",
      "The transition state formed in the above reaction is less polar than the localised anion.",
      "The solvent used in the reaction solvates the ions formed in rate determining step"
    ],
    "answer": "The transition state formed in the above reaction is less polar than the localised anion."
  },
  {
    "section": "Chemistry",
    "question_number": 46,
    "content": "The major products A and B from the following reactions are:<br><div class='flex justify-center my-4'><img src='images/3/q46.png' alt='Chemistry Question 46'></div>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 3"
  },
  {
    "section": "Chemistry",
    "question_number": 47,
    "content": "The major product formed in the following reaction is<br><div class='flex justify-center my-4'><img src='images/3/q47.png' alt='Chemistry Question 47'></div>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  },
  {
    "section": "Chemistry",
    "question_number": 48,
    "content": "Compound P (M.F. \\(C_{14}H_{13}ON\\)) -> Hydrolysis -> Q + R. Q gives effervescence with \\(NaHCO_{3}\\) while R reacts with Hinsberg's reagent to give solid soluble in NaOH. Compound P is<br><div class='flex justify-center my-4'><img src='images/3/q48.png' alt='Chemistry Question 48'></div>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 4"
  },
  {
    "section": "Chemistry",
    "question_number": 49,
    "content": "Polymer used in orlon is:",
    "options": [
      "Polyethene",
      "Polycarbonate",
      "Polyamide",
      "Polyacrylonitrile"
    ],
    "answer": "Polyacrylonitrile"
  },
  {
    "section": "Chemistry",
    "question_number": 50,
    "content": "Match List I and List II<br>List I (Vitamin)<br>A Vitamin A<br>B Thiamine<br>C Ascorbic acid<br>D Riboflavin<br>List II (Deficiency disease)<br>I Beri-Beri<br>II Cheilosis<br>III Xerophthalmia<br>IV Scurvy",
    "options": [
      "A-III, B-I, C-IV, D-II",
      "A-IV, B-I, C-III, D-II",
      "A-IV, B-II, C-III, D-I",
      "A-III, B-II, C-IV, D-I"
    ],
    "answer": "A-III, B-I, C-IV, D-II"
  },
  {
    "section": "Chemistry",
    "question_number": 51,
    "content": "If 5 moles of \\(BaCl_{2}\\) is mixed with 2 moles of \\(Na_{3}PO_{4},\\) the maximum number of moles of \\(Ba_{3}(PO_{4})_{2}\\) formed is (Nearest integer)",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "question_number": 52,
    "content": "The wavelength of an electron of kinetic energy \\(4.50\\times10^{-29}\\) J is ___ \\(\\times10^{-5}\\) m. (Nearest integer) Given: mass of electron is \\(9\\times10^{-31}\\) kg, \\(h=6.6\\times10^{-34}\\) Js",
    "options": [],
    "answer": "7"
  },
  {
    "section": "Chemistry",
    "question_number": 53,
    "content": "The number of species from the following which have square pyramidal structure is: \\(PF_{5}, BrF_{4}^{-}, IF_{5}, BrF_{5}, XeOF_{4}, ICl_{4}^{-}\\)",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "question_number": 54,
    "content": "The value of log K for the reaction \\(A\\rightleftharpoons B\\) at 298 K is ___ (Nearest integer). Given: \\(\\Delta H^{\\circ}=-54.07~kJ~mol^{-1}\\), \\(\\Delta S^{\\circ}=10~JK^{-1}mol^{-1}\\). (Taken \\(2.303\\times8.314\\times298=5705\\))",
    "options": [],
    "answer": "10"
  },
  {
    "section": "Chemistry",
    "question_number": 55,
    "content": "Consider the graph of Gibbs free energy G vs extent of reaction. The number of statement/s from the following which are true with respect to points (a), (b) and (c) is<br><div class='flex justify-center my-4'><img src='images/3/q55.png' alt='Chemistry Question 55'></div>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "question_number": 56,
    "content": "Number of bromo derivatives obtained on treating ethane with excess of \\(Br_{2}\\) in diffused sunlight is",
    "options": [],
    "answer": "9"
  },
  {
    "section": "Chemistry",
    "question_number": 57,
    "content": "Mass of Urea \\(NH_{2}CONH_{2}\\) required to be dissolved in 1000 g of water in order to reduce the vapour pressure of water by 25% is ___ g. (Nearest integer)",
    "options": [],
    "answer": "1111"
  },
  {
    "section": "Chemistry",
    "question_number": 58,
    "content": "For the adsorption of hydrogen on platinum, the activation energy is 30 kJ mol⁻¹ and for the adsorption of hydrogen on nickel, the activation energy is 41.4 kJ mol⁻¹. The logarithm of the ratio of the rates of chemisorption on equal areas of the metals at 300 K is ___ (Nearest integer) Given: \\(ln~10=2.3\\), \\(R=8.3\\) J K⁻¹ mol⁻¹",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "question_number": 59,
    "content": "In ammonium - phosphomolybdate, the oxidation state of Mo is +___",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Chemistry",
    "question_number": 60,
    "content": "Number of ambidentate ligands in a representative metal complex \\([M(en)(SCN)_{4}]\\) is ___",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "question_number": 61,
    "content": "The sum of all the roots of the equation \\(|x^{2}-8x+15|-2x+7=0\\) is",
    "options": [
      "\\(9-\\sqrt{3}\\)",
      "\\(9+\\sqrt{3}\\)",
      "\\(11-\\sqrt{3}\\)",
      "\\(11+\\sqrt{3}\\)"
    ],
    "answer": "\\(9+\\sqrt{3}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 62,
    "content": "The sum of the first 20 terms of the series \\(5+11+19+29+41+...\\) is",
    "options": [
      "3520",
      "3450",
      "3250",
      "3420"
    ],
    "answer": "3520"
  },
  {
    "section": "Mathematics",
    "question_number": 63,
    "content": "Let \\(a_{1},a_{2},a_{3},....,a_{n}\\) be n positive consecutive terms of an arithmetic progression. If \\(d>0\\) is its common difference, then \\(\\lim_{n\\rightarrow\\infty}\\sqrt{\\frac{d}{n}}(\\frac{1}{\\sqrt{a_{1}}+\\sqrt{a_{2}}}+\\frac{1}{\\sqrt{a_{2}}+\\sqrt{a_{3}}}+...+\\frac{1}{\\sqrt{a_{n-1}}+\\sqrt{a_{n}}})\\) is",
    "options": [
      "\\(\\frac{1}{\\sqrt{a}}\\)",
      "\\(\\sqrt{d}\\)",
      "1",
      "2"
    ],
    "answer": "1"
  },
  {
    "section": "Mathematics",
    "question_number": 64,
    "content": "If the ratio of the fifth term from the beginning to the fifth term from the end in the expansion of \\((\\sqrt[4]{2}+\\frac{1}{\\sqrt[4]{3}})^{n}\\) is \\(\\sqrt{6}:1\\), then the third term from the beginning is:",
    "options": [
      "\\(30\\sqrt{2}\\)",
      "\\(30\\sqrt{3}\\)",
      "\\(60\\sqrt{2}\\)",
      "\\(60\\sqrt{3}\\)"
    ],
    "answer": "\\(60\\sqrt{3}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 65,
    "content": "If \\({}^{2n}C_{3} : {}^{n}C_{3}=10:1,\\) then the ratio \\(n^{2}+3n:n^{2}-3n+4\\) is",
    "options": [
      "35:16",
      "27:11",
      "65:37",
      "2:1"
    ],
    "answer": "2:1"
  },
  {
    "section": "Mathematics",
    "question_number": 66,
    "content": "The straight lines \\(l_{1}\\) and \\(l_{2}\\) pass through the origin and trisect the line segment of the line L: \\(9x+5y=45\\) between the axes. If \\(m_{1}\\) and \\(m_{2}\\) are the slopes of the lines \\(l_{1}\\) and \\(l_{2},\\) then the point of intersection of the line \\(y=(m_{1}+m_{2})x\\) with L lies on",
    "options": [
      "\\(y-2x=5\\)",
      "\\(6x+y=10\\)",
      "\\(y-x=5\\)",
      "\\(6x-y=15\\)"
    ],
    "answer": "\\(y-x=5\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 67,
    "content": "Statement \\((P\\Rightarrow Q)\\wedge(R\\Rightarrow Q)\\) is logically equivalent to",
    "options": [
      "\\(P\\Rightarrow (R\\vee Q)\\Rightarrow R\\)",
      "\\((P\\wedge R)\\Rightarrow Q\\)",
      "\\((P\\Rightarrow R)\\wedge (Q\\Rightarrow R)\\)",
      "\\((P\\vee R)\\Rightarrow Q\\)"
    ],
    "answer": "\\((P\\vee R)\\Rightarrow Q\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 68,
    "content": "The mean and variance of a set of 15 numbers are 12 and 14 respectively. The mean and variance of another set of 15 numbers are 14 and \\(\\sigma^{2}\\) respectively. If the variance of all the 30 numbers in the two sets is 13, then \\(\\sigma^{2}\\) is equal to",
    "options": [
      "10",
      "11",
      "9",
      "12"
    ],
    "answer": "10"
  },
  {
    "section": "Mathematics",
    "question_number": 69,
    "content": "From the top A of a vertical wall AB of height 30 m, the angles of depression of the top P and bottom Q of a vertical tower PQ are \\(15^{\\circ}\\) and \\(60^{\\circ}\\) respectively, B and Q are on the same horizontal level. If C is a point on AB such that \\(CB=PQ\\) then the area (in \\(m^{2}\\)) of the quadrilateral BCPQ is equal to",
    "options": [
      "\\(300(\\sqrt{3}-1)\\)",
      "\\(300(\\sqrt{3}+1)\\)",
      "\\(600(\\sqrt{3}-1)\\)",
      "\\(200(\\sqrt{3}-1)\\)"
    ],
    "answer": "\\(600(\\sqrt{3}-1)\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 70,
    "content": "Let \\(A=[a_{ij}]_{2\\times2}\\) where \\(a_{ij}\\ne0\\) for all i, j and \\(A^{2}=I\\). Let a be the sum of all diagonal elements of A and \\(b=det(A)\\). Then \\(3a^{2}+4b^{2}\\) is equal to",
    "options": [
      "4",
      "14",
      "7",
      "3"
    ],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "question_number": 71,
    "content": "If the system of equations \\(x+y+az=b\\), \\(2x+5y+2z=6\\), \\(x+2y+3z=3\\) has infinitely many solutions, then \\(2a+3b\\) is equal to",
    "options": [
      "25",
      "20",
      "23",
      "28"
    ],
    "answer": "23"
  },
  {
    "section": "Mathematics",
    "question_number": 72,
    "content": "Let \\(5f(x)+4f(\\frac{1}{x})=\\frac{1}{x}+3,\\) \\(x>0\\). Then \\(18 \\int_{1}^{2}f(x)dx\\) is equal to",
    "options": [
      "\\(5~log_{e}2+3\\)",
      "\\(10~log_{e}2+6\\)",
      "\\(10~log_{e}2-6\\)",
      "\\(5~log_{e}2-3\\)"
    ],
    "answer": "\\(10~log_{e}2-6\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 73,
    "content": "Let \\(A=\\{x\\in\\mathbb{R}:|x+3|+|x+4|\\le3\\}\\), \\(B=\\{x\\in\\mathbb{R}:3^{x}\\sum_{r=1}^{\\infty}(\\frac{3}{10})^{r}<3^{-3x}\\}\\). Then,",
    "options": [
      "\\(B\\subset C\\), \\(A\\ne B\\)",
      "\\(A\\cap B=\\phi\\)",
      "\\(A\\subset B\\)",
      "\\(A=B\\)"
    ],
    "answer": "\\(A=B\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 74,
    "content": "If \\(x^{y}+3y^{x}=20\\), then \\(\\frac{dy}{dx}\\) at (2, 2) is equal to:",
    "options": [
      "\\(-\\frac{2+log_{e}8}{3+log_{e}4}\\)",
      "\\(-\\frac{3+log_{e}16}{4+log_{e}8}\\)",
      "\\(-\\frac{3+log_{e}8}{2+log_{e}4}\\)",
      "\\(-\\frac{3+log_{e}4}{2+log_{e}8}\\)"
    ],
    "answer": "\\(-\\frac{2+log_{e}8}{3+log_{e}4}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 75,
    "content": "Let \\(I(x)=\\int\\frac{x^{2}(x~sec^{2}x+tanx)}{(x~tanx+1)^{2}}dx\\). If \\(I(0)=0\\) then \\(I(\\frac{\\pi}{4})\\) is equal to",
    "options": [
      "\\(log_{e}\\frac{(\\pi+4)^{2}}{16}+\\frac{\\pi^{2}}{4(\\pi+4)}\\)",
      "\\(log_{e}\\frac{(\\pi+4)^{2}}{16}-\\frac{\\pi^{2}}{4(\\pi+4)}\\)",
      "\\(log_{e}\\frac{(\\pi+4)^{2}}{32}-\\frac{\\pi^{2}}{4(\\pi+4)}\\)",
      "\\(log_{e}\\frac{(\\pi+4)^{2}}{32}+\\frac{\\pi^{2}}{4(\\pi+4)}\\)"
    ],
    "answer": "\\(log_{e}\\frac{(\\pi+4)^{2}}{32}-\\frac{\\pi^{2}}{4(\\pi+4)}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 76,
    "content": "Let the position vectors of the points A, B, C and D be \\(5\\hat{i}+5\\hat{j}+2\\lambda\\hat{k}\\), \\(\\hat{i} + 2\\hat{j} + 3\\hat{k}\\), \\(- 2\\hat{i} + \\lambda\\hat{j} + 4\\hat{k}\\) and \\(-\\hat{i}+5\\hat{j}+6\\hat{k}\\). Let the set \\(S=\\{\\lambda\\in\\mathbb{R}:\\) the points A, B, C and D are coplanar}. The \\(\\sum_{\\lambda\\in S}(\\lambda+2)^{2}\\) is equal to",
    "options": [
      "25",
      "37/2",
      "14",
      "41"
    ],
    "answer": "41"
  },
  {
    "section": "Mathematics",
    "question_number": 77,
    "content": "Let \\(\\vec{a}=2\\hat{i}+3\\hat{j}+4\\hat{k}\\), \\(\\vec{b}=\\hat{i}-2\\hat{j}-2\\hat{k}\\) and \\(\\vec{c}=-\\hat{i}+4\\hat{j}+3\\hat{k}\\). If \\(\\vec{d}\\) is a vector perpendicular to both \\(\\vec{b}\\) and \\(\\vec{c}\\), and \\(\\vec{a}\\cdot\\vec{d}=18\\), then \\(|\\vec{a}\\times\\vec{d}|^{2}\\) is equal to",
    "options": [
      "640",
      "680",
      "720",
      "760"
    ],
    "answer": "720"
  },
  {
    "section": "Mathematics",
    "question_number": 78,
    "content": "One vertex of a rectangular parallelopiped is at the origin O and the lengths of its edges along x, y and z axes are 3, 4 and 5 units respectively. Let P be the vertex (3, 4, 5). Then the shortest distance between the diagonal OP and an edge parallel to z axis, not passing through O or P is",
    "options": [
      "\\(\\frac{12}{\\sqrt{5}}\\)",
      "\\(12\\sqrt{5}\\)",
      "\\(\\frac{12}{5\\sqrt{5}}\\)",
      "\\(\\frac{12}{5}\\)"
    ],
    "answer": "\\(\\frac{12}{5}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 79,
    "content": "If the equation of the plane passing through the line of intersection of the planes \\(2x-y+z=3\\), \\(4x-3y+5z+9=0\\) and parallel to the line \\(\\frac{x+1}{-2}=\\frac{y+3}{4}=\\frac{z-2}{5}\\) is \\(ax+by+cz+6=0\\), then \\(a+b+c\\) is equal to",
    "options": [
      "12",
      "14",
      "16",
      "13"
    ],
    "answer": "14"
  },
  {
    "section": "Mathematics",
    "question_number": 80,
    "content": "A pair of dice is thrown 5 times. For each throw, a total of 5 is considered a success. If the probability of at least 4 successes is \\(\\frac{k}{3^{11}}\\), then k is equal to",
    "options": [
      "82",
      "75",
      "164",
      "123"
    ],
    "answer": "123"
  },
  {
    "section": "Mathematics",
    "question_number": 81,
    "content": "The number of ways of giving 20 distinct oranges to 3 children such that each child gets at least one orange is",
    "options": [],
    "answer": "171"
  },
  {
    "section": "Mathematics",
    "question_number": 82,
    "content": "The coefficient of \\(x^{18}\\) in the expansion of \\((x^{4}-\\frac{1}{x^{3}})^{15}\\) is",
    "options": [],
    "answer": "5005"
  },
  {
    "section": "Mathematics",
    "question_number": 83,
    "content": "A circle passing through the point P(a, b) in the first quadrant touches the two coordinate axes at the points A and B. The point P is above the line AB. The point Q on the line segment AB is the foot of perpendicular from P on AB. If PQ is equal to 11 units, then the value of ab is",
    "options": [],
    "answer": "121"
  },
  {
    "section": "Mathematics",
    "question_number": 84,
    "content": "Let the point (p, p+1) lie inside the region \\(E = \\{(x,y): 3-x\\le y\\le\\sqrt{9-x^{2}}, 0\\le x\\le3\\}\\). If the set of all values of p is the interval [a, b], then \\(b^{2}+b-a^{2}\\) is equal to",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Mathematics",
    "question_number": 85,
    "content": "Let \\(A=\\{1,2,3,4,..........10\\}\\) and \\(B=\\{0,1,2,3,4\\}\\). The number of elements in the relation \\(R=\\{(a,b)\\in A\\times A:2(a-b)^{2}+3(a-b)\\in B\\}\\) is",
    "options": [],
    "answer": "18"
  },
  {
    "section": "Mathematics",
    "question_number": 86,
    "content": "Let \\(a\\in\\mathbb{Z}\\) and [t] be the greatest integer \\(\\le t\\) then the number of points, where the function \\(f(x)=[a+13\\sin x]\\), \\(x\\in(0, \\pi)\\) is not differentiable, is",
    "options": [],
    "answer": "25"
  },
  {
    "section": "Mathematics",
    "question_number": 87,
    "content": "Let the tangent to the curve \\(x^{2}+2x-4y+9=0\\) at the point P(1, 3) on it meet the y-axis at A. Let the line passing through P and parallel to the line \\(x-3y=6\\) meet the parabola \\(y^{2}=4x\\) at B. If B lies on the line \\(2x-3y=8,\\) then \\(AB^{2}\\) is equal to",
    "options": [],
    "answer": "292"
  },
  {
    "section": "Mathematics",
    "question_number": 88,
    "content": "If the area of the region \\(S=\\{(x,y): |y-x|\\le x^{2}\\le2y, x\\ge y\\}\\) is equal to \\(\\frac{n+2}{n+1}-\\frac{\\pi}{n-1}\\), then the natural number n is equal to",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Mathematics",
    "question_number": 89,
    "content": "Let \\(y=y(x)\\) be a solution of the differential equation \\((x\\cos x)dy+(xy\\sin x+y\\cos x-1)dx=0,0<x<\\frac{\\pi}{2}\\). If \\(\\frac{\\pi}{3}y(\\frac{\\pi}{3})=\\sqrt{3},\\) then \\(\\frac{\\pi}{6}y(\\frac{\\pi}{6})+2y(\\frac{\\pi}{6})\\) is equal to",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 90,
    "content": "Let the image of the point \\(P(1,2,3)\\) in the plane \\(2x-y+z=9\\) be Q. If the coordinates of the point R are (6, 10, 7), then the square of the area of the triangle PQR is",
    "options": [],
    "answer": "594"
  }
  ],  
  4: [{
    "section": "Physics",
    "question_number": 1,
    "content": "A particle starts with an initial velocity of \\(10.0~ms^{-1}\\) along x-direction and accelerates uniformly at the rate of 2.0 m \\(s^{-2}\\). The time taken by the particle to reach the velocity of \\(60.0~m~s^{-1}\\) is",
    "options": [
      "25 s",
      "3 s",
      "6 s",
      "30 s"
    ],
    "answer": "25 s"
  },
  {
    "section": "Physics",
    "question_number": 2,
    "content": "As shown in the figure, a particle is moving with constant speed \\(\\pi~m~s^{-1}\\). Considering its motion from A to B, the magnitude of the average velocity is:<br><div class='flex justify-center my-4'><img src='images/4/q2.png' alt='Physics Question 2'></div>",
    "options": [
      "\\(\\sqrt{3}ms^{-1}\\)",
      "\\(\\pi~ms^{-1}\\)",
      "\\(1.5\\sqrt{3}ms^{-1}\\)",
      "\\(2\\sqrt{3}ms^{-1}\\)"
    ],
    "answer": "\\(1.5\\sqrt{3}ms^{-1}\\)"
  },
  {
    "section": "Physics",
    "question_number": 3,
    "content": "A child of mass 5 kg is going round a merry-go-round that makes 1 rotation in 3.14 s. The radius of the merry-go-round is 2 m. The centrifugal force on the child will be",
    "options": [
      "80 N",
      "40 N",
      "100 N",
      "50 N"
    ],
    "answer": "40 N"
  },
  {
    "section": "Physics",
    "question_number": 4,
    "content": "A small particle of mass m moves in such a way that its potential energy \\(U=\\frac{1}{2}m\\omega^{2}r^{2}\\) where \\(\\omega\\) is constant and r is the distance of the particle from origin. Assuming Bohr's quantization of momentum and circular orbit, the radius of \\(n^{th}\\) orbit will be proportional to",
    "options": [
      "\\(\\sqrt{n}\\)",
      "\\(\\frac{1}{n}\\)",
      "\\(n^{2}\\)",
      "n"
    ],
    "answer": "\\(\\sqrt{n}\\)"
  },
  {
    "section": "Physics",
    "question_number": 5,
    "content": "A body is dropped on ground from a height \\(h_{1}\\) and after hitting the ground, it rebounds to a height \\(h_{2}\\). If the ratio of velocities of the body just before and after hitting ground is 4, then percentage loss in kinetic energy of the body is \\(\\frac{x}{4}\\). The value of x is",
    "options": [
      "300",
      "325",
      "375",
      "400"
    ],
    "answer": "375"
  },
  {
    "section": "Physics",
    "question_number": 6,
    "content": "A ring and a solid sphere rotating about an axis passing through their centres have same radii of gyration. The axis of rotation is perpendicular to plane of ring. The ratio of radius of ring to that of sphere is \\(\\sqrt{\\frac{2}{x}}.\\) The value of x is",
    "options": [
      "3",
      "5",
      "2",
      "4"
    ],
    "answer": "5"
  },
  {
    "section": "Physics",
    "question_number": 7,
    "content": "The weight of a body on the surface of the earth is 100 N. The gravitational force on it when taken at a height, from the surface of earth, equal to one-fourth the radius of the earth is:",
    "options": [
      "64 N",
      "25 N",
      "50 N",
      "100 N"
    ],
    "answer": "64 N"
  },
  {
    "section": "Physics",
    "question_number": 8,
    "content": "Choose the incorrect statement from the following:",
    "options": [
      "The speed of satellite in a given circular orbit remains constant",
      "For a planet revolving around the sun in elliptical orbit, the total energy of the planet remains constant",
      "The linear speed of a planet revolving around the sun remains constant",
      "When a body falls towards earth, the displacement of earth towards the body is negligible"
    ],
    "answer": "The linear speed of a planet revolving around the sun remains constant"
  },
  {
    "section": "Physics",
    "question_number": 9,
    "content": "A metal block of mass m is suspended from a rigid support through a metal wire of diameter 14 mm. The tensile stress developed in the wire under equilibrium state is \\(7\\times10^{5}N~m^{-2}\\). The value of mass m is ___ kg. (Take \\(g=9.8~m~s^{-2}\\) and \\(\\pi=\\frac{22}{7})\\)",
    "options": [],
    "answer": "11"
  },
  {
    "section": "Physics",
    "question_number": 10,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R<br>Assertion A: When you squeeze one end of a tube to get toothpaste out from the other end, Pascal's principle is observed.<br>Reason R: A change in the pressure applied to an enclosed incompressible fluid is transmitted undiminished to every portion of the fluid and to the walls of its container.<br>In the light of the above statements, choose the most appropriate answer from the options given below.",
    "options": [
      "Both A and R are correct but R is NOT the correct explanation of A",
      "A is not correct but R is correct",
      "A is correct but R is not correct",
      "Both A and R is correct and R is the correct explanation of A"
    ],
    "answer": "Both A and R is correct and R is the correct explanation of A"
  },
  {
    "section": "Physics",
    "question_number": 11,
    "content": "A body cools in 7 minutes from \\(60^{\\circ}C\\) to \\(40^{\\circ}C\\). The temperature of the surrounding is \\(10^{\\circ}C\\). The temperature of the body after the next 7 minutes will be",
    "options": [
      "\\(28^{\\circ}C\\)",
      "\\(32^{\\circ}C\\)",
      "\\(34^{\\circ}C\\)",
      "\\(30^{\\circ}C\\)"
    ],
    "answer": "\\(28^{\\circ}C\\)"
  },
  {
    "section": "Physics",
    "question_number": 12,
    "content": "The temperature of an ideal gas is increased from 200 K to 800 K. If r.m.s. speed of gas at 200 K is \\(v_{0}\\). Then, r.m.s. speed of the gas at 800 K will be:",
    "options": [
      "\\(\\frac{v_{0}}{4}\\)",
      "\\(v_{0}\\)",
      "\\(4v_{0}\\)",
      "\\(2v_{0}\\)"
    ],
    "answer": "\\(2v_{0}\\)"
  },
  {
    "section": "Physics",
    "question_number": 13,
    "content": "A simple pendulum with length 100 cm and bob of mass 250 g is executing S.H.M of amplitude 10 cm. The maximum tension in the string is found to be \\(\\frac{x}{40}N.\\) The value of x is",
    "options": [],
    "answer": "101"
  },
  {
    "section": "Physics",
    "question_number": 14,
    "content": "The ratio of speed of sound in hydrogen gas to the speed of sound in oxygen gas at the same temperature is:",
    "options": [
      "4:1",
      "1:1",
      "1:4",
      "1:2"
    ],
    "answer": "4:1"
  },
  {
    "section": "Physics",
    "question_number": 15,
    "content": "A dipole comprises of two charged particles of identical magnitude q and opposite in nature. The mass m of the positive charged particle is half of the mass of the negative charged particle. The two charges are separated by a distance l. If the dipole is placed in a uniform electric field \\(\\vec{E}\\) in such a way that dipole axis makes a very small angle with the electric field, \\(\\vec{E}\\). The angular frequency of the oscillations of the dipole when released is given by:",
    "options": [
      "\\(\\sqrt{\\frac{3qE}{2ml}}\\)",
      "\\(\\sqrt{\\frac{8qE}{ml}}\\)",
      "\\(\\sqrt{\\frac{4qE}{mL}}\\)",
      "\\(\\sqrt{\\frac{8qE}{3ml}}\\)"
    ],
    "answer": "\\(\\sqrt{\\frac{3qE}{2ml}}\\)"
  },
  {
    "section": "Physics",
    "question_number": 16,
    "content": "Experimentally it is found that 12.8 eV energy is required to separate a hydrogen atom into a proton and an electron. So the orbital radius of the electron in a hydrogen atom is \\(\\frac{9}{x}\\times10^{-10}\\) m. The value of the x is: (\\(1~eV=1.6\\times10^{-19}J\\), and electronic charge \\(=1.6\\times10^{-19}C\\)) \\(\\frac{1}{4\\pi\\epsilon_{0}}=9\\times10^{9}\\frac{Nm^{2}}{C^{2}}\\)",
    "options": [],
    "answer": "16"
  },
  {
    "section": "Physics",
    "question_number": 17,
    "content": "As shown in the figure, two parallel plate capacitors having equal plate area of 200 cm² are joined in such a way that \\(a\\ne b\\). The equivalent capacitance of the combination is \\(x\\epsilon_{0}F\\). The value of x is<br><div class='flex justify-center my-4'><img src='images/4/q17.png' alt='Physics Question 17'></div>",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Physics",
    "question_number": 18,
    "content": "A student is provided with a variable voltage source V, a test resistor \\(R_{T}=10\\Omega\\) two identical galvanometers \\(G_{1}\\) and \\(G_{2}\\) and two additional resistors, \\(R_{1}=10M\\Omega\\) and \\(R_{2}=0.001\\Omega\\). For conducting an experiment to verify ohm's law, the most suitable circuit is:<br><div class='flex justify-center my-4'><img src='images/4/q18.png' alt='Physics Question 18'></div>",
    "options": [
      "Circuit 1",
      "Circuit 2",
      "Circuit 3",
      "Circuit 4"
    ],
    "answer": "Circuit 3"
  },
  {
    "section": "Physics",
    "question_number": 19,
    "content": "Figure shows a part of an electric circuit. The potentials at points a, b and c are 30 V, 12 V and 2 V respectively. The current through the 20 Ω resistor will be,<br><div class='flex justify-center my-4'><img src='images/4/q19.png' alt='Physics Question 19'></div>",
    "options": [
      "1.0 A",
      "0.4 A",
      "0.6 A",
      "0.2 A"
    ],
    "answer": "0.4 A"
  },
  {
    "section": "Physics",
    "question_number": 20,
    "content": "As shown in the figure the voltmeter reads 2 V across 5 Ω resistor. The resistance of the voltmeter is ___ Ω<br><div class='flex justify-center my-4'><img src='images/4/q20.png' alt='Physics Question 20'></div>",
    "options": [],
    "answer": "20"
  },
  {
    "section": "Physics",
    "question_number": 21,
    "content": "A proton with a kinetic energy of 2.0 eV moves into a region of uniform magnetic field of magnitude \\(\\frac{\\pi}{2}\\times10^{-3}T\\). The angle between the direction of magnetic field and velocity of proton is \\(60^{\\circ}.\\) The pitch of the helical path taken by the proton is ___ cm. (Take, mass of proton \\(=1.6\\times10^{-27}\\) kg and charge on proton \\(=1.6\\times10^{-19}C\\)).",
    "options": [],
    "answer": "40"
  },
  {
    "section": "Physics",
    "question_number": 22,
    "content": "Two concentric circular coils with radii 1 cm and 1000 cm and number of turns 10 and 200 respectively are placed coaxially with centers coinciding. The mutual inductance of this arrangement will be ___ \\(\\times10^{-8}\\) H. (Take, \\(\\pi^{2}=10\\))",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Physics",
    "question_number": 23,
    "content": "A capacitor of capacitance 150.0 µF is connected to an alternating source of emf given by \\(E=36~sin(120\\pi t)\\) V. The maximum value of current in the circuit is approximately equal to:",
    "options": [
      "2 A",
      "\\(\\sqrt{2}A\\)",
      "\\(2\\sqrt{2}A\\)",
      "\\(\\frac{1}{\\sqrt{2}}A\\)"
    ],
    "answer": "2 A"
  },
  {
    "section": "Physics",
    "question_number": 24,
    "content": "The energy density associated with electric field \\(\\vec{E}\\) and magnetic field \\(\\vec{B}\\) of an electromagnetic wave in free space is given by (\\(\\epsilon_{0} -\\) permittivity of free space, \\(\\mu_{0}-\\) permeability of free space)",
    "options": [
      "\\(U_{E}=\\frac{E^{2}}{2\\epsilon_{0}}, U_{B}=\\frac{B^{2}}{2\\mu_{0}}\\)",
      "\\(U_{E}=\\frac{\\epsilon_{0}E^{2}}{2}, U_{B}=\\frac{B^{2}}{2\\mu_{0}}\\)",
      "\\(U_{E}=\\frac{\\epsilon_{0}E^{2}}{2}, U_{B}=\\frac{\\mu_{0}B^{2}}{2}\\)",
      "\\(U_{E}=\\frac{E^{2}}{2\\epsilon_{0}}, U_{B}=\\frac{\\mu_{0}B^{2}}{2}\\)"
    ],
    "answer": "\\(U_{E}=\\frac{\\epsilon_{0}E^{2}}{2}, U_{B}=\\frac{B^{2}}{2\\mu_{0}}\\)"
  },
  {
    "section": "Physics",
    "question_number": 25,
    "content": "A 2 meter long scale with least count of 0.2 cm is used to measure the locations of objects on an optical bench. While measuring the focal length of a convex lens, the object pin and the convex lens are placed at 80 cm mark and 1 m mark, respectively. The image of the object pin on the other side of lens coincides with image pin that is kept at 180 cm mark. The % error in the estimation of focal length is:",
    "options": [
      "0.85",
      "1.70",
      "1.02",
      "0.51"
    ],
    "answer": "0.85"
  },
  {
    "section": "Physics",
    "question_number": 26,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R<br>Assertion A: The phase difference of two light waves change if they travel through different media having same thickness, but different indices of refraction.<br>Reason R: The wavelengths of waves are different in different media.<br>In the light of the above statements, choose the most appropriate answer from the options given below",
    "options": [
      "Both A and R are correct but R is NOT the correct explanation of A",
      "A is not correct but R is correct",
      "A is correct but R is not correct",
      "Both A and R are correct and R is the correct explanation of A"
    ],
    "answer": "Both A and R are correct and R is the correct explanation of A"
  },
  {
    "section": "Physics",
    "question_number": 27,
    "content": "A beam of light consisting of two wavelengths 7000 \\(\\mathring{A}\\) and 5500 \\(\\mathring{A}\\) is used to obtain interference pattern in Young's double slit experiment. The distance between the slits is 2.5 mm and the distance between the plane of slits and the screen is 150 cm. The least distance from the central fringe, where the bright fringes due to both the wavelengths coincide, is \\(n\\times10^{-5}\\) m. The value of n is",
    "options": [],
    "answer": "462"
  },
  {
    "section": "Physics",
    "question_number": 28,
    "content": "The work functions of Aluminium and Gold are 4.1 eV and 5.1 eV respectively. The ratio of the slope of the stopping potential versus frequency plot for Gold to that of Aluminium is",
    "options": [
      "1.24",
      "2",
      "1",
      "1.5"
    ],
    "answer": "1"
  },
  {
    "section": "Physics",
    "question_number": 29,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R<br>Assertion A: Diffusion current in a \\(p-n\\) junction is greater than the drift current in magnitude if the junction is forward biased.<br>Reason R: Diffusion current in a \\(p-n\\) junction is form the n-side to the p-side if the junction is forward biased.<br>In the light of the above statements, choose the most appropriate answer from the options given below.",
    "options": [
      "Both A and R are correct but R is NOT the correct explanation of A",
      "A is correct but R is not correct",
      "A is not correct but R is correct",
      "Both A and R is correct and R is the correct explanation of A"
    ],
    "answer": "A is correct but R is not correct"
  },
  {
    "section": "Physics",
    "question_number": 30,
    "content": "For an amplitude modulated wave the minimum amplitude is 3 V, while the modulation index is 60%. The maximum amplitude of the modulated wave is:",
    "options": [
      "5 V",
      "15 V",
      "12 V",
      "10 V"
    ],
    "answer": "12 V"
  },
  {
    "section": "Chemistry",
    "question_number": 31,
    "content": "If the radius of the first orbit of hydrogen atom is \\(a_{0}\\), then de Broglie's wavelength of electron in 3rd orbit is",
    "options": [
      "\\(\\frac{\\pi a_{0}}{6}\\)",
      "\\(\\frac{\\pi a_{0}}{3}\\)",
      "\\(6\\pi a_{0}\\)",
      "\\(3\\pi a_{0}\\)"
    ],
    "answer": "\\(6\\pi a_{0}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 32,
    "content": "Which one of the following elements will remain as liquid inside pure boiling water?",
    "options": [
      "Ga",
      "Br",
      "Li",
      "Cs"
    ],
    "answer": "Ga"
  },
  {
    "section": "Chemistry",
    "question_number": 33,
    "content": "Group-13 elements react with \\(O_{2}\\) in amorphous form to form oxides of type \\(M_{2}O_{3}\\) (M = element). Which among the following is the most basic oxide?",
    "options": [
      "\\(Al_{2}O_{3}\\)",
      "\\(B_{2}O_{3}\\)",
      "\\(Tl_{2}O_{3}\\)",
      "\\(Ga_{2}O_{3}\\)"
    ],
    "answer": "\\(Tl_{2}O_{3}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 34,
    "content": "The number of species having a square planar shape from the following is: \\(XeF_{4}, SF_{4}, SiF_{4}, BF_{4}^{-}, BrF_{4}^{-}, [Cu(NH_{3})_{4}]^{2+}, [FeCl_{4}]^{2-}, [PtCl_{4}]^{2-}\\)",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 35,
    "content": "In an ice crystal, each water molecule is hydrogen bonded to ___ neighbouring molecules.",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 36,
    "content": "Consider the following data<br>Heat of combustion of \\(H_{2}(g)=-241.8~kJ~mol^{-1}\\)<br>Heat of combustion of \\(C(s)=-393.5~kJ~mol^{-1}\\)<br>Heat of combustion of \\(C_{2}H_{5}OH(l)=-1234.7~kJ~mol^{-1}\\)<br>The heat of formation of \\(C_{2}H_{5}OH(l)\\) is (-) ___ kJ mol⁻¹ (Nearest integer).",
    "options": [],
    "answer": "278"
  },
  {
    "section": "Chemistry",
    "question_number": 37,
    "content": "The equilibrium composition for the reaction \\(PCl_{3}+Cl_{2}\\rightleftharpoons PCl_{5}\\) at 298 K is given below: \\([PCl_{3}]_{eq}=0.2\\) mol \\(L^{-1}\\), \\([Cl_{2}]_{eq}=0.1\\) mol \\(L^{-1}\\), \\([PCl_{5}]_{eq}=0.40\\) mol \\(L^{-1}\\). If 0.2 mol of \\(Cl_{2}\\) is added at the same temperature, the equilibrium concentrations of \\(PCl_{5}\\) is ___ \\(\\times10^{-2}\\) mol \\(L^{-1}\\). Given: \\(K_{c}\\) for the reaction at 298 K is 20",
    "options": [],
    "answer": "49"
  },
  {
    "section": "Chemistry",
    "question_number": 38,
    "content": "During the reaction of permanganate with thiosulphate, the change in oxidation of manganese occurs by value of 3. Identify which of the below medium will favour the reaction.",
    "options": [
      "Both aqueous acidic and neutral",
      "Aqueous neutral",
      "Both aqueous acidic and faintly alkaline",
      "Aqueous acidic"
    ],
    "answer": "Aqueous neutral"
  },
  {
    "section": "Chemistry",
    "question_number": 39,
    "content": "The volume of 0.02 M aqueous HBr required to neutralize 10.0 mL of 0.01 M aqueous \\(Ba(OH)_{2}\\) is (Assume complete neutralization)",
    "options": [
      "2.5 mL",
      "5.0 mL",
      "10.0 mL",
      "7.5 mL"
    ],
    "answer": "10.0 mL"
  },
  {
    "section": "Chemistry",
    "question_number": 40,
    "content": "Ion having highest hydration enthalpy among the given alkaline earth metal ions is:",
    "options": [
      "\\(Be^{2+}\\)",
      "\\(Sr^{2+}\\)",
      "\\(Ba^{2+}\\)",
      "\\(Ca^{2+}\\)"
    ],
    "answer": "\\(Be^{2+}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 41,
    "content": "Structures of \\(BeCl_{2}\\) in solid state, vapour phase and at very high temperature respectively are:",
    "options": [
      "Monomeric, Dimeric, Polymeric",
      "Dimeric, Polymeric, Monomeric",
      "Polymeric, Monomeric, Dimeric",
      "Polymeric, Dimeric, Monomeric"
    ],
    "answer": "Polymeric, Dimeric, Monomeric"
  },
  {
    "section": "Chemistry",
    "question_number": 42,
    "content": "From the figure of column chromatography given below, identify incorrect statements.<br><div class='flex justify-center my-4'><img src='images/4/q42.png' alt='Chemistry Question 42'></div><br>A. Compound 'c' is more polar than 'a' and 'b'<br>B. Compound 'a' is least polar<br>C. Compound 'b' comes out of the column before 'c' and after 'a'<br>D. Compound 'a' spends more time in the column<br>Choose the correct answer from the options given below",
    "options": [
      "A, B and D only",
      "A, B and C only",
      "B and D only",
      "B, C and D only"
    ],
    "answer": "B and D only"
  },
  {
    "section": "Chemistry",
    "question_number": 43,
    "content": "The strongest acid from the following is",
    "options": [
      "Option 1: m-nitrophenol",
      "Option 2: m-cresol",
      "Option 3: m-chlorophenol",
      "Option 4: Phenol"
    ],
    "answer": "Option 1: m-nitrophenol"
  },
  {
    "section": "Chemistry",
    "question_number": 44,
    "content": "The group of chemicals used as pesticide is",
    "options": [
      "Aldrin, Sodium Chlorate, Sodium arsinite",
      "DDT, Aldrin",
      "Sodium chlorate, DDT, PAN",
      "Dieldrin, Sodium arsinite, Tetrachloroethene"
    ],
    "answer": "DDT, Aldrin"
  },
  {
    "section": "Chemistry",
    "question_number": 45,
    "content": "Number of crystal systems from the following where body centred unit cell can be found, is: Cubic, tetragonal, orthorhombic, hexagonal, rhombohedral, monoclinic, triclinic",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "question_number": 46,
    "content": "Consider the following pairs of solution which will be isotonic at the same temperature. The number of pairs of solutions is/are<br>A. 1 M aq. NaCl and 2 M aq. urea<br>B. 1 M aq. \\(CaCl_{2}\\) and 1.5 M aq. KCl<br>C. 1.5 M aq. \\(AlCl_{3}\\) and 2 M aq. \\(Na_{2}SO_{4}\\)<br>D. 2.5 M aq. KCl and 1 M aq. \\(Al_{2}(SO_{4})_{3}\\)",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 47,
    "content": "The product, which is not obtained during the electrolysis of brine solution is",
    "options": [
      "\\(H_{2}\\)",
      "HCl",
      "NaOH",
      "\\(Cl_{2}\\)"
    ],
    "answer": "HCl"
  },
  {
    "section": "Chemistry",
    "question_number": 48,
    "content": "The standard reduction potentials at 295 K for the following half cells are given below:<br>\\(NO_{3}^{-}+4H^{+}+3e^{-}\\rightarrow NO(g)+2H_{2}O\\) E = 0.97 V<br>\\(V^{2+}(aq)+2e^{-}\\rightarrow V(s)\\) E = -1.19 V<br>\\(Fe^{3+}(aq)+3e^{-}\\rightarrow Fe(s)\\) E = -0.04 V<br>\\(Ag^{+}(aq)+e^{-}\\rightarrow Ag(s)\\) E = 0.80 V<br>\\(Au^{3+}(aq)+3e^{-}\\rightarrow Au(s)\\) E = 1.40 V<br>The number of metal(s) which will be oxidised by \\(NO_{3}^{-}\\) in aqueous solution is",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "question_number": 49,
    "content": "Consider the following reaction that goes from A to B in three steps as shown below:<br><div class='flex justify-center my-4'><img src='images/4/q49.png' alt='Chemistry Question 49'></div><br>Choose the correct option",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  },
  {
    "section": "Chemistry",
    "question_number": 50,
    "content": "The number of colloidal systems from the following, which will have 'liquid' as the dispersion medium, is: Gem stones, paints, smoke, cheese, milk, hair cream, insecticide sprays, froth, soap lather",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Chemistry",
    "question_number": 51,
    "content": "The IUPAC name of \\(K_{3}[Co(C_{2}O_{4})_{3}]\\) is:",
    "options": [
      "Potassium tris(oxalato) cobaltate (III)",
      "Potassium tris(oxalato) cobalt (III)",
      "Potassium trioxalatocobalt (III)",
      "Potassium trioxalatocobaltate (III)"
    ],
    "answer": "Potassium trioxalatocobaltate (III)"
  },
  {
    "section": "Chemistry",
    "question_number": 52,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R<br>Assertion A: In the complex \\(Ni(CO)_{4}\\) and \\(Fe(CO)_{5}\\), the metals have zero oxidation state.<br>Reason R: Low oxidation states are found when a complex has ligands capable of \\(\\pi\\)-donor character in addition to the \\(\\sigma\\)-bonding.<br>In the light of the above statements, choose the most appropriate answer from the options given below",
    "options": [
      "A is correct but R is not correct",
      "A is not correct but R is correct",
      "Both A and R are correct but R is NOT the correct explanation of A",
      "Both A and R are correct and R is the correct explanation of A"
    ],
    "answer": "A is correct but R is not correct"
  },
  {
    "section": "Chemistry",
    "question_number": 53,
    "content": "Element not present in Nessler's reagent is",
    "options": [
      "N",
      "Hg",
      "I",
      "K"
    ],
    "answer": "N"
  },
  {
    "section": "Chemistry",
    "question_number": 54,
    "content": "In the following reaction, 'B' is<br><div class='flex justify-center my-4'><img src='images/4/q54.png' alt='Chemistry Question 54'></div>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 4"
  },
  {
    "section": "Chemistry",
    "question_number": 55,
    "content": "Find out the major product from the following reaction.<br><div class='flex justify-center my-4'><img src='images/4/q55.png' alt='Chemistry Question 55'></div>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 3"
  },
  {
    "section": "Chemistry",
    "question_number": 56,
    "content": "Among the following the number of compounds which will give positive iodoform reaction is: (a) 1-Phenylbutan-2-one, (b) 2-Methylbutan-2-ol, (c) 3-Methylbutan-2-ol, (d) 1-Phenylethanol, (e) 3, 3-dimethylbutan-2-one, (f) 1-Phenylpropan-2-ol",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 57,
    "content": "Number of isomeric aromatic amines with molecular formula \\(C_{8}H_{11}N,\\) which can be synthesized by Gabriel Phthalimide synthesis is",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Chemistry",
    "question_number": 58,
    "content": "Given below are two statements:<br>Statement I: Morphine is a narcotic analgesic. It helps in relieving pain without producing sleep.<br>Statement II: Morphine and its derivatives are obtained from opium poppy.<br>In the light of the above statements, choose the correct answer from the options given below",
    "options": [
      "Both Statement I and Statement II are true",
      "Statement I is true but Statement II is false",
      "Both Statement I and Statement II are false",
      "Statement I is false but Statement II is true"
    ],
    "answer": "Statement I is false but Statement II is true"
  },
  {
    "section": "Chemistry",
    "question_number": 59,
    "content": "Formation of which complex, among the following, is not a confirmatory test of \\(Pb^{2+}\\) ions",
    "options": [
      "Lead sulphate",
      "Lead nitrate",
      "Lead chromate",
      "Lead iodide"
    ],
    "answer": "Lead nitrate"
  },
  {
    "section": "Chemistry",
    "question_number": 60,
    "content": "Match List-I with List-II.<br>List-I (Natural Amino acid): (A) Arginine, (B) Aspartic acid, (C) Asparagine, (D) Alanine<br>List-II (One Letter Code): (I) D, (II) N, (III) A, (IV) R",
    "options": [
      "(A)-IV, B-I, (C)-II, (D)-III",
      "(A)-I, B-III, (C)-IV, (D)-II",
      "(A)-III, B-I, (C)-II, (D)-IV",
      "(A)-IV, B-I, (C)-III, (D)-II"
    ],
    "answer": "(A)-IV, B-I, (C)-II, (D)-III"
  },
  {
    "section": "Mathematics",
    "question_number": 61,
    "content": "Let \\(a\\ne b\\) be two non-zero real numbers. Then the number of elements in the set \\(X=\\{z\\in C:Re(az^{2}+bz)=a\\) and \\(Re(bz^{2}+az)=b\\}\\) is equal to",
    "options": [
      "0",
      "1",
      "3",
      "2"
    ],
    "answer": "0"
  },
  {
    "section": "Mathematics",
    "question_number": 62,
    "content": "For \\(\\alpha, \\beta, z\\in\\mathbb{C}\\) and \\(\\lambda>1,\\) if \\(\\sqrt{\\lambda-1}\\) is the radius of the circle \\(|z-\\alpha|^{2}+|z-\\beta|^{2}=2\\lambda\\) then \\(|\\alpha-\\beta|\\) equal to",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 63,
    "content": "All the letters of the word PUBLIC are written in all possible orders and these words are written as in a dictionary with serial numbers. Then the serial number of the word PUBLIC is",
    "options": [
      "576",
      "578",
      "580",
      "582"
    ],
    "answer": "582"
  },
  {
    "section": "Mathematics",
    "question_number": 64,
    "content": "The number of 4-letter words, with or without meaning, each consisting of 2 vowels and 2 consonants, which can be formed from the letters of the word UNIVERSE without repetition is",
    "options": [],
    "answer": "432"
  },
  {
    "section": "Mathematics",
    "question_number": 65,
    "content": "If \\(gcd(m,n)=1\\) and \\(1^{2}-2^{2}+3^{2}-4^{2}+...+(2021)^{2}-(2022)^{2}+(2023)^{2}=1012m^{2}n\\) then \\(m^{2}-n^{2}\\) is equal to",
    "options": [
      "240",
      "200",
      "220",
      "180"
    ],
    "answer": "240"
  },
  {
    "section": "Mathematics",
    "question_number": 66,
    "content": "If \\((20)^{19}+2(21)(20)^{18}+3(21)^{2}(20)^{17}+...+20(21)^{19}=k(20)^{19},\\) then k is equal to",
    "options": [],
    "answer": "400"
  },
  {
    "section": "Mathematics",
    "question_number": 67,
    "content": "If the coefficients of \\(x^{7}\\) in \\((ax^{2}+\\frac{1}{2bx})^{11}\\) and \\(x^{-7}\\) in \\((ax-\\frac{1}{3bx^{2}})^{11}\\) are equal, then",
    "options": [
      "\\(729ab=32\\)",
      "\\(32ab=729\\)",
      "\\(64ab=243\\)",
      "\\(243ab=64\\)"
    ],
    "answer": "\\(32ab=729\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 68,
    "content": "Among the statements:<br>(S1): \\(2023^{2022}-1999^{2022}\\) is divisible by 8.<br>(S2): \\(13(13)^{n}-11n-13\\) is divisible by 144 for infinitely many \\(n\\in\\mathbb{N}\\)<br>",
    "options": [
      "Only (S2) is correct",
      "Only (S1) is correct",
      "Both (S1) and (S2) are correct",
      "Both (S1) and (S2) are incorrect"
    ],
    "answer": "Only (S2) is correct"
  },
  {
    "section": "Mathematics",
    "question_number": 69,
    "content": "The value of \\(tan~9^{\\circ}-tan~27^{\\circ}-tan~63^{\\circ}+tan~81^{\\circ}\\) is",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "question_number": 70,
    "content": "If the tangents at the points P and Q on the circle \\(x^{2}+y^{2}-2x+y=5\\) meet at the point \\(R(\\frac{9}{4},2)\\), then the area of the triangle PQR is",
    "options": [
      "\\(\\frac{5}{8}\\)",
      "\\(\\frac{13}{8}\\)",
      "\\(\\frac{5}{4}\\)",
      "\\(\\frac{13}{4}\\)"
    ],
    "answer": "\\(\\frac{5}{8}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 71,
    "content": "Let the eccentricity of an ellipse \\(\\frac{x^{2}}{a^{2}}+\\frac{y^{2}}{b^{2}}=1\\) is reciprocal to that of the hyperbola \\(2x^{2}-2y^{2}=1\\) If the ellipse intersects the hyperbola at right angles, then square of length of the latus-rectum of the ellipse is",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 72,
    "content": "\\(lim_{n\\rightarrow\\infty}\\{(2^{\\frac{1}{2}}-2^{\\frac{1}{3}})(2^{\\frac{1}{2^{2}}}-2^{\\frac{1}{5}})...(2^{\\frac{1}{2^{n-1}}}-2^{\\frac{1}{2n+1}})\\}\\) is equal to",
    "options": [
      "1",
      "0",
      "\\(\\sqrt{2}\\)",
      "\\(\\frac{1}{\\sqrt{2}}\\)"
    ],
    "answer": "1"
  },
  {
    "section": "Mathematics",
    "question_number": 73,
    "content": "Among the statements<br>(S1): \\((p\\Rightarrow q)\\vee((-p)\\wedge q)\\) is a tautology<br>(S2): \\((q\\Rightarrow p)\\Rightarrow((-p)\\wedge q)\\) is a contradiction",
    "options": [
      "Neither (S1) and (S2) is True",
      "Both (S1) and (S2) are True",
      "Only (S2) is True",
      "Only (S1) is True"
    ],
    "answer": "Only (S2) is True"
  },
  {
    "section": "Mathematics",
    "question_number": 74,
    "content": "If the mean and variance of the frequency distribution [x: 4, 6, 8, 10, 12, 14, 16; f: 4, 4, alpha, 15, 8, beta, 4] are 9 and 15.08 respectively, then the value of \\(\\alpha^{2}+\\beta^{2}-\\alpha\\beta\\) is",
    "options": [],
    "answer": "25"
  },
  {
    "section": "Mathematics",
    "question_number": 75,
    "content": "In a group of 100 persons 75 speak English and 40 speak Hindi. Each person speaks at least one of the two languages. If the number of persons who speak only English is \\(\\alpha\\) and the number of persons who speaks only Hindi is \\(\\beta\\), then the eccentricity of the ellipse \\(25(\\beta^{2}x^{2}+\\alpha^{2}y^{2})=\\alpha^{2}\\beta^{2}\\) is",
    "options": [
      "\\(\\frac{\\sqrt{119}}{12}\\)",
      "\\(\\frac{\\sqrt{117}}{12}\\)",
      "\\(\\frac{3\\sqrt{15}}{12}\\)",
      "\\(\\frac{\\sqrt{129}}{12}\\)"
    ],
    "answer": "\\(\\frac{\\sqrt{119}}{12}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 76,
    "content": "Let P be a square matrix such that \\(P^{2}=I-P\\). For \\(\\alpha, \\beta, \\gamma, \\delta\\in\\mathbb{N}\\), if \\(P^{\\alpha}+P^{\\beta}=\\gamma I-29P\\) and \\(P^{\\alpha}-P^{\\beta}=\\delta I-13P,\\) then \\(\\alpha+\\beta+\\gamma-\\delta\\) is equal to",
    "options": [
      "18",
      "40",
      "22",
      "24"
    ],
    "answer": "24"
  },
  {
    "section": "Mathematics",
    "question_number": 77,
    "content": "For the system of equations \\(x+y+z=6, x+2y+\\alpha z=10, x+3y+5z=\\beta,\\) which one of the following is NOT true?",
    "options": [
      "System has no solution for \\(\\alpha=3, \\beta=24\\)",
      "System has a unique solution for \\(\\alpha=-3, \\beta=14\\)",
      "System has infinitely many solutions for \\(\\alpha=3, \\beta=14\\)",
      "System has a unique solution for \\(\\alpha=3, \\beta\\ne14\\)"
    ],
    "answer": "System has a unique solution for \\(\\alpha=3, \\beta\\ne14\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 78,
    "content": "Let the sets A and B denote the domain and range respectively of the function \\(f(x)=\\frac{1}{\\sqrt{[x]-x}}\\) where [x] denotes the smallest integer greater than or equal to x. Then among the statements<br>(S1): \\(A\\cap B=(1,\\infty)-\\mathbb{N}\\)<br>(S2): \\(A\\cup B=(1,\\infty)\\)",
    "options": [
      "Only (S2) is true",
      "Only (S1) is true",
      "Neither (S1) nor (S2) is true",
      "Both (S1) and (S2) are true"
    ],
    "answer": "Only (S1) is true"
  },
  {
    "section": "Mathematics",
    "question_number": 79,
    "content": "Let a curve \\(y=f(x), x\\in(0,\\infty)\\) pass through the points \\(P(1,\\frac{3}{2})\\) and \\(Q(a,\\frac{1}{2})\\). If the tangent at any point \\(R(b,f(b))\\) to the given curve cuts the y-axis at the point \\(S(0,c)\\) such that \\(bc=3\\), then \\((PQ)^{2}\\) is equal to",
    "options": [
      "5",
      "\\(\\frac{25}{4}\\)",
      "\\(\\frac{125}{2}\\)",
      "\\(\\frac{125}{8}\\)"
    ],
    "answer": "5"
  },
  {
    "section": "Mathematics",
    "question_number": 80,
    "content": "The number of points, where the curve \\(y=x^{5}-20x^{3}+50x+2\\) crosses the x-axis, is",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Mathematics",
    "question_number": 81,
    "content": "Let \\(f(x)\\) be a function satisfying \\(f(x)+f(\\pi-x)=\\pi^{2},\\forall x\\in\\mathbb{R}.\\) Then \\(\\int_{0}^{\\pi}f(x)sin~x~dx\\) is equal to",
    "options": [
      "\\(\\frac{\\pi^{2}}{4}\\)",
      "\\(2\\pi^{2}\\)",
      "\\(\\pi^{2}\\)",
      "\\(\\frac{\\pi^{2}}{2}\\)"
    ],
    "answer": "\\(2\\pi^{2}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 82,
    "content": "Let \\(x\\in\\mathbb{R}-\\{-1\\}\\) \\(n\\in\\mathbb{N}, n>2\\). If \\(f^{n}(x)=(fofof....\\) up to n times) (x), then \\(lim_{n\\rightarrow\\infty}\\int_{0}^{1}x^{n-2}(f^{n}(x))dx\\) is equal to \\(\\frac{1}{\\pi}\\)",
    "options": [],
    "answer": "0"
  },
  {
    "section": "Mathematics",
    "question_number": 83,
    "content": "The area bounded by the curves \\(y=|x-1|+|x-2|\\) and \\(y=3\\) is equal to",
    "options": [
      "4",
      "6",
      "3",
      "5"
    ],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "question_number": 84,
    "content": "If the solution curve \\(f(x,y)=0\\) of the differential equation \\((1+log_{e}x)\\frac{dx}{dy}-x~log_{e}x=e^{y}, x>0\\), passes through the points (1, 0) and (a, 2), then \\(a^{a}\\) is equal to",
    "options": [
      "\\(e^{2e^{2}}\\)",
      "\\(e^{e^{2}}\\)",
      "\\(e^{\\sqrt{2e}^{2}}\\)",
      "\\(e^{2e\\sqrt{2}}\\)"
    ],
    "answer": "\\(e^{2e^{2}}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 85,
    "content": "Let the vectors \\(\\vec{a}, \\vec{b}, \\vec{c}\\) represent three coterminous edges of a parallelopiped of volume V. Then the volume of the parallelopiped, whose coterminous edges are represented by \\(\\vec{a}, \\vec{b} + \\vec{c}\\) and \\(\\vec{a}+2\\vec{b}+3\\vec{c}\\) is equal to",
    "options": [
      "2V",
      "6V",
      "V",
      "3V"
    ],
    "answer": "V"
  },
  {
    "section": "Mathematics",
    "question_number": 86,
    "content": "The sum of all values of \\(\\alpha\\), for which the points whose position vectors are \\(\\hat{i}-2\\hat{j}+3\\hat{k}, 2\\hat{i}-3\\hat{j}+4\\hat{k}, (\\alpha+1)\\hat{i}+2\\hat{k}\\) and \\(9\\hat{i}+(\\alpha-8)\\hat{j}+6\\hat{k}\\) are coplanar, is equal to",
    "options": [
      "-2",
      "2",
      "6",
      "4"
    ],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 87,
    "content": "Let the line L pass through the point (0, 1, 2), intersect the line \\(\\frac{x-1}{2}=\\frac{y-2}{3}=\\frac{z-3}{4}\\) and be parallel to the plane \\(2x+y-3z=4.\\) Then the distance of the point \\(P(1,-9,2)\\) from the line L is",
    "options": [
      "\\(\\sqrt{74}\\)",
      "\\(\\sqrt{69}\\)",
      "\\(\\sqrt{54}\\)",
      "9"
    ],
    "answer": "9"
  },
  {
    "section": "Mathematics",
    "question_number": 88,
    "content": "A plane P contains the line of intersection of the plane \\(\\vec{r}\\cdot(\\hat{i}+\\hat{j}+\\hat{k})=6\\) and \\(\\vec{r}\\cdot(2\\hat{i}+3\\hat{j}+4\\hat{k})=-5.\\) If P passes through the point (0,2,2), then the square of distance of the point (12, 12, 18) from the plane P is",
    "options": [
      "620",
      "155",
      "310",
      "1240"
    ],
    "answer": "620"
  },
  {
    "section": "Mathematics",
    "question_number": 89,
    "content": "If the lines \\(\\frac{x-1}{2}=\\frac{2-y}{-3}=\\frac{z-3}{\\alpha}\\) and \\(\\frac{x-4}{5}=\\frac{y-1}{2}=\\frac{z}{\\beta}\\) intersect, then the magnitude of the minimum value of \\(8\\alpha\\beta\\) is",
    "options": [],
    "answer": "18"
  },
  {
    "section": "Mathematics",
    "question_number": 90,
    "content": "Three dice are rolled. If the probability of getting different numbers on the three dice is \\(\\frac{p}{q}\\), where p and q are co-prime, then \\(q-p\\) is equal to",
    "options": [
      "2",
      "1",
      "3",
      "4"
    ],
    "answer": "4"
  }],
        // Continue for papers 3 to 70...
       5:[ {
    "section": "Physics",
    "question_number": 1,
    "content": "A cylindrical wire of mass \\((0.4\\pm0.01)\\) g has length \\((8\\pm0.04)\\) cm and radius \\((6\\pm0.03)\\) mm. The maximum error in its density will be",
    "options": [
      "3.5%",
      "5%",
      "1%",
      "4%"
    ],
    "answer": "4%"
  },
  {
    "section": "Physics",
    "question_number": 2,
    "content": "Two forces having magnitude A and \\(\\frac{A}{2}\\) are perpendicular to each other. The magnitude of their resultant is:",
    "options": [
      "\\(\\frac{\\sqrt{5}A}{4}\\)",
      "\\(\\frac{\\sqrt{5}A}{2}\\)",
      "\\(\\frac{5A}{2}\\)",
      "\\(\\frac{\\sqrt{5}A^{2}}{2}\\)"
    ],
    "answer": "\\(\\frac{\\sqrt{5}A}{2}\\)"
  },
  {
    "section": "Physics",
    "question_number": 3,
    "content": "Dimension of \\(\\frac{1}{\\mu_{0}\\epsilon_{0}}\\), should be equal to",
    "options": [
      "\\(L~T^{-1}\\)",
      "\\(T^{2}L^{-2}\\)",
      "\\(L^{2}T^{-2}\\)",
      "\\(TL^{-1}\\)"
    ],
    "answer": "\\(L^{2}T^{-2}\\)"
  },
  {
    "section": "Physics",
    "question_number": 4,
    "content": "Two projectiles A and B are thrown with initial velocities of \\(40~m~s^{-1}\\) and \\(60~m~s^{-1}\\) at angles \\(30^{\\circ}\\) and \\(60^{\\circ}\\) with the horizontal respectively. The ratio of their ranges respectively is \\((g=10~m~s^{-2})\\)",
    "options": [
      "4:9",
      "2: \\(\\sqrt{3}\\)",
      "\\(\\sqrt{3}:2\\)",
      "1:1"
    ],
    "answer": "4:9"
  },
  {
    "section": "Physics",
    "question_number": 5,
    "content": "At any instant the velocity of a particle of mass 500 g is \\((2t\\hat{i}+3t^{2}\\hat{j})m~s^{-1}\\). If the force acting on the particle at t = 1 s is \\((\\hat{i}+x\\hat{j})\\) N. Then the value of x will be:",
    "options": [
      "3",
      "4",
      "2",
      "6"
    ],
    "answer": "3"
  },
  {
    "section": "Physics",
    "question_number": 6,
    "content": "The momentum of a body is increased by 50%. The percentage increase in the kinetic energy of the body is ___ %.",
    "options": [
      "100",
      "125",
      "50",
      "150"
    ],
    "answer": "125"
  },
  {
    "section": "Physics",
    "question_number": 7,
    "content": "The moment of inertia of a semicircular ring about an axis, passing through the center and perpendicular to the plane of ring, is \\(\\frac{1}{x}MR^{2}\\) where R is the radius and M is the mass of the semicircular ring. The value of x will be",
    "options": [
      "1",
      "2",
      "4",
      "3"
    ],
    "answer": "1"
  },
  {
    "section": "Physics",
    "question_number": 8,
    "content": "Given below are two statements:<br>Statement I: If E be the total energy of a satellite moving around the earth, then its potential energy will be \\(\\frac{E}{2}\\).<br>Statement II: The kinetic energy of a satellite revolving in an orbit is equal to the half the magnitude of total energy E.<br>In the light of the above statements, choose the most appropriate answer from the options given below.",
    "options": [
      "Statement I is correct but Statement II is incorrect",
      "Statement I is incorrect but Statement II is correct",
      "Both Statement I and Statement II are correct",
      "Both Statement I and Statement II are incorrect"
    ],
    "answer": "Both Statement I and Statement II are correct"
  },
  {
    "section": "Physics",
    "question_number": 9,
    "content": "The weight of a body on the earth is 400 N. Then weight of the body when taken to a depth half of the radius of the earth will be:",
    "options": [
      "200 N",
      "Zero",
      "100 N",
      "300 N"
    ],
    "answer": "200 N"
  },
  {
    "section": "Physics",
    "question_number": 10,
    "content": "An aluminium rod with Young's modulus \\(Y=7.0\\times10^{10}N~m^{-2}\\) undergoes elastic strain of 0.04%. The energy per unit volume stored in the rod in SI unit is",
    "options": [
      "2800",
      "11200",
      "5600",
      "8400"
    ],
    "answer": "5600"
  },
  {
    "section": "Physics",
    "question_number": 11,
    "content": "An air bubble of volume 1 \\(cm^{3}\\) rises from the bottom of a lake 40 m deep to the surface at a temperature of \\(12^{\\circ}C\\). The atmospheric pressure is \\(1\\times10^{5}\\) Pa, the density of water is \\(1000~kg~m^{-3}\\) and \\(g=10~m~s^{-2}\\). There is no difference of the temperature of water at the depth of 40 m and on the surface. The volume of air bubble when it reaches the surface will be",
    "options": [
      "2 \\(cm^{3}\\)",
      "3 \\(cm^{3}\\)",
      "4 \\(cm^{3}\\)",
      "5 \\(cm^{3}\\)"
    ],
    "answer": "5 \\(cm^{3}\\)"
  },
  {
    "section": "Physics",
    "question_number": 12,
    "content": "An air bubble of diameter 6 mm rises steadily through a solution of density \\(1750~kg~m^{-3}\\) at the rate of \\(0.35~cm~s^{-1}\\). The co-efficient of viscosity of the solution (neglect density of air) is ___ Pas (given, \\(g=10~m~s^{-2})\\).",
    "options": [
      "10",
      "11",
      "12",
      "15"
    ],
    "answer": "10"
  },
  {
    "section": "Physics",
    "question_number": 13,
    "content": "Given below are two statements:<br>Statement I: If heat is added to a system, its temperature must increase.<br>Statement II: If positive work is done by a system in a thermodynamic process, its volume must increase.<br>In the light of the above statements, choose the correct answer from the options given below",
    "options": [
      "Statement I is true but Statement II is false",
      "Both Statement I and Statement II are false",
      "Both Statement I and Statement II are true",
      "Statement I is false but Statement II is true"
    ],
    "answer": "Statement I is false but Statement II is true"
  },
  {
    "section": "Physics",
    "question_number": 14,
    "content": "The engine of a train moving with speed \\(10~m~s^{-1}\\) towards a platform sounds a whistle at frequency 400 Hz. The frequency heard by a passenger inside the train is: (Neglect air speed. Speed of sound in air \\(=330~m~s^{-1}\\))",
    "options": [
      "400 Hz",
      "200 Hz",
      "412 Hz",
      "388 Hz"
    ],
    "answer": "400 Hz"
  },
  {
    "section": "Physics",
    "question_number": 15,
    "content": "An organ pipe 40 cm long is open at both ends. The speed of sound in air is 360 m \\(s^{-1}\\). The frequency of the second harmonic is ___ Hz.",
    "options": [
      "800",
      "900",
      "450",
      "360"
    ],
    "answer": "900"
  },
  {
    "section": "Physics",
    "question_number": 16,
    "content": "Graphical variation of electric field due to a uniformly charged insulating solid sphere of radius R, with distance r from the centre O is represented by:<br><div class='flex justify-center my-4'><img src='images/5/q16.png' alt='Physics Question 16'></div>",
    "options": [
      "Graph 1",
      "Graph 2",
      "Graph 3",
      "Graph 4"
    ],
    "answer": "Graph 2"
  },
  {
    "section": "Physics",
    "question_number": 17,
    "content": "An electric dipole of dipole moment is \\(6.0\\times10^{-6}\\) Cm placed in a uniform electric field of \\(1.5\\times10^{3}\\) \\(NC^{-1}\\) in such a way that dipole moment is along electric field. The work done in rotating dipole by 180° in this field will be ___ mJ.",
    "options": [
      "18",
      "9",
      "6",
      "12"
    ],
    "answer": "18"
  },
  {
    "section": "Physics",
    "question_number": 18,
    "content": "In this figure the resistance of the coil of galvanometer G is 2Ω. The emf of the cell is 4 V. The ratio of potential difference across \\(C_{1}\\) and \\(C_{2}\\) is<br><div class='flex justify-center my-4'><img src='images/5/q18.png' alt='Physics Question 18'></div>",
    "options": [
      "1",
      "\\(\\frac{4}{5}\\)",
      "\\(\\frac{5}{4}\\)",
      "\\(\\frac{3}{4}\\)"
    ],
    "answer": "\\(\\frac{4}{5}\\)"
  },
  {
    "section": "Physics",
    "question_number": 19,
    "content": "A current of 2 A flows through a wire of cross-sectional area \\(25.0~mm^{2}\\). The number of free electrons in a cubic meter are \\(2.0\\times10^{28}\\). The drift velocity of the electrons is ___ \\(\\times10^{-6}ms^{-1}\\) (given, charge on electron \\(=1.6\\times10^{-19}C)\\)",
    "options": [
      "25",
      "10",
      "50",
      "5"
    ],
    "answer": "25"
  },
  {
    "section": "Physics",
    "question_number": 20,
    "content": "Certain galvanometers have a fixed core made of non magnetic metallic material. The function of this metallic material is",
    "options": [
      "to oscillate the coil in magnetic field for longer period of time",
      "to bring the coil to rest quickly",
      "to produce large deflecting torque on the coil",
      "to make the magnetic field radial"
    ],
    "answer": "to bring the coil to rest quickly"
  },
  {
    "section": "Physics",
    "question_number": 21,
    "content": "A charge particle moving in magnetic field B, has the components of velocity along B as well as perpendicular to B. The path of the charge particle will be",
    "options": [
      "helical path with the axis perpendicular to the direction of magnetic field B",
      "helical path with the axis along magnetic field B",
      "circular path",
      "straight along the direction of magnetic field B"
    ],
    "answer": "helical path with the axis along magnetic field B"
  },
  {
    "section": "Physics",
    "question_number": 22,
    "content": "The magnetic intensity at the centre of a long current carrying solenoid is found to be \\(1.6\\times10^{3}A~m^{-1}\\). If the number of turns is 8 per cm, then the current flowing through the solenoid is ___ A.",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Physics",
    "question_number": 23,
    "content": "An oscillating LC circuit consists of a 75 mH inductor and a 1.2 µF capacitor. If the maximum charge to the capacitor is 2.7 µC. The maximum current in the circuit will be ___ mA.",
    "options": [],
    "answer": "10"
  },
  {
    "section": "Physics",
    "question_number": 24,
    "content": "In a reflecting telescope, a secondary mirror is used to:",
    "options": [
      "reduce the problem of mechanical support",
      "make chromatic aberration zero",
      "move the eyepiece outside the telescopic tube",
      "remove spherical aberration"
    ],
    "answer": "move the eyepiece outside the telescopic tube"
  },
  {
    "section": "Physics",
    "question_number": 25,
    "content": "Two vertical parallel mirrors A and B are separated by 10 cm. A point object O is placed at a distance of 2 cm from mirror A. The distance of the second nearest image behind mirror A from the mirror A is ___ cm.<br><div class='flex justify-center my-4'><img src='images/5/q25.png' alt='Physics Question 25'></div>",
    "options": [],
    "answer": "18"
  },
  {
    "section": "Physics",
    "question_number": 26,
    "content": "Proton (P) and electron (e) will have same de-Broglie wavelength when the ratio of their momentum is (assume, \\(m_{p}=1849~m_{e})\\)",
    "options": [
      "1:1",
      "1:1849",
      "1:43",
      "43:1"
    ],
    "answer": "1:1"
  },
  {
    "section": "Physics",
    "question_number": 27,
    "content": "For a nucleus \\({}_{Z}X^{A}\\) having mass number A and atomic number Z<br>A. The surface energy per nucleon \\((b_{s})=-a_{1}A^{\\frac{2}{3}}\\).<br>B. The Coulomb contribution to the binding energy \\(b_{c}=-a_{2}\\frac{Z(Z-1)}{A^{\\frac{1}{3}}}\\).<br>C. The volume energy \\(b_{v}=a_{3}A\\)<br>D. Decrease in the binding energy is proportional to surface area.<br>E. While estimating the surface energy, it is assumed that each nucleon interacts with 12 nucleons. (\\(a_{1}, a_{2}\\) and \\(a_{3}\\) are constants)<br>Choose the most appropriate answer from the options given below:",
    "options": [
      "B, C, E only",
      "C, D only",
      "A, B, C, D only",
      "B, C only"
    ],
    "answer": "C, D only"
  },
  {
    "section": "Physics",
    "question_number": 28,
    "content": "A nucleus with mass number 242 and binding energy per nucleon as 7.6 MeV breaks into two fragment each with mass number 121. If each fragment nucleus has binding energy per nucleon as 8.1 MeV, the total gain in binding energy is ___ MeV.",
    "options": [],
    "answer": "121"
  },
  {
    "section": "Physics",
    "question_number": 29,
    "content": "For the logic circuit shown, the output waveform at Y is<br><div class='flex justify-center my-4'><img src='images/5/q29.png' alt='Physics Question 29'></div>",
    "options": [
      "Waveform 1",
      "Waveform 2",
      "Waveform 3",
      "Waveform 4"
    ],
    "answer": "Waveform 3"
  },
  {
    "section": "Physics",
    "question_number": 30,
    "content": "A TV transmitting antenna is 98 m high and the receiving antenna is at the ground level. If the radius of the earth is 6400 km, the surface area covered by the transmitting antenna is approximately:",
    "options": [
      "\\(1240~km^{2}\\)",
      "\\(3942~km^{2}\\)",
      "\\(4868~km^{2}\\)",
      "\\(1549~km^{2}\\)"
    ],
    "answer": "\\(3942~km^{2}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 31,
    "content": "0.5 g of an organic compound (X) with 60% carbon will produce ___ \\(\\times10^{-1}\\) g of \\(CO_{2}\\) on complete combustion.",
    "options": [],
    "answer": "11"
  },
  {
    "section": "Chemistry",
    "question_number": 32,
    "content": "The number of following statement/s which is/are incorrect is<br>A) Line emission spectra are used to study the electronic structure<br>B) The emission spectra of atoms in the gas phase show a continuous spread of wavelength from red to violet.<br>C) An absorption spectrum is like the photographic negative of an emission spectrum<br>D) The element helium was discovered in the sun by spectroscopic method",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "question_number": 33,
    "content": "The correct order of electronegativity for given elements is",
    "options": [
      "\\(P>Br>C>At\\)",
      "\\(Br>P>At>C\\)",
      "\\(Br>C>At>P\\)",
      "\\(C>P>At>Br\\)"
    ],
    "answer": "\\(Br>C>At>P\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 34,
    "content": "Given below are two statements: One is labelled as Assertion A and the other is labelled as Reason R.<br>Assertion A: Butan-1-ol has higher boiling point than ethoxyethane.<br>Reason R: Extensive hydrogen bonding leads to stronger association of molecules.<br>In the light of the above statements, choose the correct answer from the options given below :",
    "options": [
      "A is true but R is false",
      "Both A and R are true and R is the correct explanation of A",
      "Both A and R are true but R is not the correct explanation of A",
      "A is false but R is true"
    ],
    "answer": "Both A and R are true and R is the correct explanation of A"
  },
  {
    "section": "Chemistry",
    "question_number": 35,
    "content": "The number of following factors which affect the percent covalent character of the ionic bond is<br>A) Polarising power of cation<br>B) Extent of distortion of anion<br>C) Polarisability of the anion<br>D) Polarising power of anion",
    "options": [
      "4",
      "3",
      "2",
      "1"
    ],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "question_number": 36,
    "content": "Three bulbs are filled with \\(CH_{4}\\), \\(CO_{2}\\) and Ne as shown in the picture. The bulbs are connected through pipes of zero volume. When the stopcocks are opened and the temperature is kept constant throughout, the pressure of the system is found to be ___ atm. (Nearest integer).<br><div class='flex justify-center my-4'><img src='images/5/q36.png' alt='Chemistry Question 36'></div>",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "question_number": 37,
    "content": "When a 60 W electric heater is immersed in a gas for 100 s in a constant volume container with adiabatic walls, the temperature of the gas rises by \\(5^{\\circ}C\\). The heat capacity of the given gas is ___ \\(JK^{-1}\\) (Nearest integer)",
    "options": [],
    "answer": "1200"
  },
  {
    "section": "Chemistry",
    "question_number": 38,
    "content": "The titration curve of weak acid vs. strong base with phenolphthalein as indicator is shown below. The \\(K_{phenolphthalein}=4\\times10^{-10}\\). Given: \\(log~2=0.3\\).<br><div class='flex justify-center my-4'><img src='images/5/q38.png' alt='Chemistry Question 38'></div><br>The number of following statement/s which is/are correct about phenolphthalein is<br>A. It can be used as an indicator for the titration of weak acid with weak base.<br>B. It begins to change colour at \\(pH=8.4\\)<br>C. It is a weak organic base<br>D. It is colourless in acidic medium",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "question_number": 39,
    "content": "\\(2~IO_{3}^{-}+xI^{-}+12H^{+}\\rightarrow6I_{2}+6H_{2}O\\). What is the value of x?",
    "options": [
      "2",
      "12",
      "10",
      "6"
    ],
    "answer": "10"
  },
  {
    "section": "Chemistry",
    "question_number": 40,
    "content": "Given below are two statements:<br>Statement I: Lithium and Magnesium do not form superoxide<br>Statement II: The ionic radius of \\(Li^{+}\\) is larger than ionic radius of \\(Mg^{2+}\\). In the light of the above statements, choose the most appropriate answer from the questions given below :",
    "options": [
      "Statement I is incorrect but Statement II is correct",
      "Statement I is correct but Statement II is incorrect",
      "Both statement I and Statement II are incorrect",
      "Both Statement I and Statement II are correct"
    ],
    "answer": "Both Statement I and Statement II are correct"
  },
  {
    "section": "Chemistry",
    "question_number": 41,
    "content": "What is the purpose of adding gypsum to cement?",
    "options": [
      "To facilitate the hydration of cement",
      "To slow down the process of setting",
      "To give a hard mass",
      "To speed up the process of setting"
    ],
    "answer": "To slow down the process of setting"
  },
  {
    "section": "Chemistry",
    "question_number": 42,
    "content": "Molar mass of the hydrocarbon (X) which on ozonolysis consumes one mole of \\(O_{3}\\) per mole of (X) and gives one mole each of ethanal and propanone is ___ \\(g~mol^{-1}\\) (Molar mass of \\(C:12~g~mol^{-1}\\), \\(H:1g~mol^{-1}\\))",
    "options": [],
    "answer": "70"
  },
  {
    "section": "Chemistry",
    "question_number": 43,
    "content": "Match List I with List II<br>List-I (Species)<br>A \\(F^{-}\\)<br>B \\(SO_{4}^{2-}\\)<br>C \\(NO_{3}^{-}\\)<br>D Zn<br>List-II (Maximum allowed concentration in ppm in drinking water)<br>I < 50 ppm<br>II < 5 ppm<br>III < 500 ppm<br>IV < 2 ppm",
    "options": [
      "A-I, B-II, C-III, D-IV",
      "A-II, B-I, C-III, D-IV",
      "A-IV, B-III, C-II, D-I",
      "A-III, B-II, C-I, D-IV"
    ],
    "answer": "A-II, B-I, C-III, D-IV"
  },
  {
    "section": "Chemistry",
    "question_number": 44,
    "content": "The vapour pressure vs. temperature curve for a solution solvent system is shown below. The boiling point of the solvent is ___ \\(^{\\circ}C\\).<br><div class='flex justify-center my-4'><img src='images/5/q44.png' alt='Chemistry Question 44'></div>",
    "options": [],
    "answer": "82"
  },
  {
    "section": "Chemistry",
    "question_number": 45,
    "content": "The reaction \\(\\frac{1}{2}H_{2}(g)+AgCl(s)\\rightleftharpoons H^{+}(aq)+Cl^{-}(aq)+Ag(s)\\) occurs in which of the given galvanic cell?",
    "options": [
      "Pt | H2(g) | HCl(sol) | AgCl(s) | Ag",
      "Ag | AgCl(s) | KCl(sol) | AgNO3 | Ag",
      "Pt | H2(g) | HCl(sol) | AgNO3(sol) | Ag",
      "Pt | H2(g) | KCl(sol) | AgCl(s) | Ag"
    ],
    "answer": "Pt | H2(g) | HCl(sol) | AgCl(s) | Ag"
  },
  {
    "section": "Chemistry",
    "question_number": 46,
    "content": "The number of given statement/s which is/are correct is<br>(A) The stronger the temperature dependence of the rate constant, the higher is the activation energy.<br>(B) If a reaction has zero activation energy, its rate is independent of temperature.<br>(C) The stronger the temperature dependence of the rate constant, the smaller is the activation energy.<br>(D) If there is no correlation between the temperature and the rate constant then it means that the reaction has negative activation energy.",
    "options": [
      "4",
      "2",
      "3",
      "1"
    ],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "question_number": 47,
    "content": "The water gas on reacting with cobalt as a catalyst forms",
    "options": [
      "Methanal",
      "Methanoic acid",
      "Ethanol",
      "Methanol"
    ],
    "answer": "Methanol"
  },
  {
    "section": "Chemistry",
    "question_number": 48,
    "content": "Which of the following represents the Freundlich adsorption isotherms?<br><div class='flex justify-center my-4'><img src='images/5/q48.png' alt='Chemistry Question 48'></div>",
    "options": [
      "A, C, D only",
      "A, B only",
      "B, C, D only",
      "A, B, D only"
    ],
    "answer": "A, B, D only"
  },
  {
    "section": "Chemistry",
    "question_number": 49,
    "content": "Which of the following metals can be extracted through alkali leaching technique?",
    "options": [
      "Sn",
      "Pb",
      "Au",
      "Cu"
    ],
    "answer": "Sn"
  },
  {
    "section": "Chemistry",
    "question_number": 50,
    "content": "\\(XeF_{4}\\) reacts with \\(SbF_{5}\\) to form \\([XeF_{m}]^{n+}[SbF_{y}]^{z-}\\). \\(m+n+y+z=?\\).",
    "options": [],
    "answer": "11"
  },
  {
    "section": "Chemistry",
    "question_number": 51,
    "content": "In chromyl chloride, the number of d-electrons present on chromium is same as in (Given at no. of Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26)",
    "options": [
      "V (IV)",
      "Mn (VII)",
      "Fe (III)",
      "Ti (III)"
    ],
    "answer": "Mn (VII)"
  },
  {
    "section": "Chemistry",
    "question_number": 52,
    "content": "Which halogen is known to cause the reaction given below? \\(2Cu^{2+}+4X^{-}\\rightarrow Cu_{2}X_{2}(s)+X_{2}\\)",
    "options": [
      "All halogens",
      "Only Bromine",
      "Only Iodine",
      "Only Chlorine"
    ],
    "answer": "Only Iodine"
  },
  {
    "section": "Chemistry",
    "question_number": 53,
    "content": "Which of the following complex is octahedral, diamagnetic and the most stable?",
    "options": [
      "\\(Na_{3}[CoCl_{6}]\\)",
      "\\([Ni(NH_{3})_{6}]Cl_{2}\\)",
      "\\(K_{3}[Co(CN)_{6}]\\)",
      "\\([Co(H_{2}O)_{6}]Cl_{2}\\)"
    ],
    "answer": "\\(K_{3}[Co(CN)_{6}]\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 54,
    "content": "The correct order of spin only magnetic moments for the following complex ions is",
    "options": [
      "\\([Fe(CN)_{6}]^{3-}<[CoF_{6}]^{3-}<[MnBr_{4}]^{2-}\\)",
      "\\([MnBr_{4}]^{2-}<[Fe(CN)_{6}]^{3-}<[CoF_{6}]^{3-}\\)",
      "\\([Fe(CN)_{6}]^{3-}<[CoF_{6}]^{3-}<[MnBr_{4}]^{2-}\\) (Repeated Option)",
      "\\([CoF_{6}]^{3-}<[MnBr_{4}]^{2-}<[Fe(CN)_{6}]^{3-}\\)"
    ],
    "answer": "\\([Fe(CN)_{6}]^{3-}<[CoF_{6}]^{3-}<[MnBr_{4}]^{2-}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 55,
    "content": "Choose the halogen which is most reactive towards SN1 reaction in the given compounds (A, B, C & D)<br><div class='flex justify-center my-4'><img src='images/5/q55.png' alt='Chemistry Question 55'></div>",
    "options": [
      "\\(A-Br_{(b)}; B-I_{(a)}; C-Br_{(a)}; D-Br_{(a)}\\)",
      "\\(A-Br_{(b)}; B-I_{(a)}; C-Br_{(b)}; D-Br_{(b)}\\)",
      "\\(A-Br_{(a)}; B-I_{(a)}; C-Br_{(b)}; D-Br_{(a)}\\)",
      "\\(A-Br_{(a)}; B-I_{(a)}; C-Br_{(a)}; D-Br_{(a)}\\)"
    ],
    "answer": "\\(A-Br_{(b)}; B-I_{(a)}; C-Br_{(a)}; D-Br_{(a)}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 56,
    "content": "The major product formed in the following reaction is<br><div class='flex justify-center my-4'><img src='images/5/q56.png' alt='Chemistry Question 56'></div>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  },
  {
    "section": "Chemistry",
    "question_number": 57,
    "content": "Match List I with List II:<br>List I (Reagents used)<br>A. Alkaline solution of copper sulphate and sodium citrate<br>B. Neutral \\(FeCl_{3}\\) solution<br>C. Alkaline chloroform solution<br>D. Potassium iodide and sodium hypochlorite<br>List II (Compound with Functional group detected)<br>I. Phenol<br>II. Primary amine<br>III. Methyl ketone<br>IV. Aldehyde",
    "options": [
      "A-III, B-IV, C-I, D-II",
      "A-III, B-IV, C-II, D-I",
      "A-IV, B-I, C-II, D-III",
      "A-II, B-IV, C-III, D-I"
    ],
    "answer": "A-IV, B-I, C-II, D-III"
  },
  {
    "section": "Chemistry",
    "question_number": 58,
    "content": "Benzene diazonium chloride is reacted with reagents in List I to form products in List II. Match List I with List II:<br><div class='flex justify-center my-4'><img src='images/5/q58.png' alt='Chemistry Question 58'></div>",
    "options": [
      "A-IV, B-III, C-II, D-I",
      "A-III, B-I, C-II, D-IV",
      "A-I, B-III, C-IV, D-II",
      "A-III, B-I, C-IV, D-II"
    ],
    "answer": "A-III, B-I, C-II, D-IV"
  },
  {
    "section": "Chemistry",
    "question_number": 59,
    "content": "Match List I with List II:<br>List I (Sweetener)<br>A. Saccharin<br>B. Aspartame<br>C. Alitame<br>D. Sucralose<br>List II (Property)<br>I. High potency sweetener<br>II. First artificial sweetening agent<br>III. Stable at cooking temperature<br>IV. Unstable at cooking temperature",
    "options": [
      "A-IV, B-III, C-I, D-II",
      "A-II, B-IV, C-I, D-III",
      "A-II, B-III, C-IV, D-I",
      "A-II, B-IV, C-I, D-III"
    ],
    "answer": "A-II, B-IV, C-I, D-III"
  },
  {
    "section": "Chemistry",
    "question_number": 60,
    "content": "Sulphur (S) containing amino acids from the following are: (a) isoleucine, (b) cysteine, (c) lysine, (d) methionine, (e) glutamic acid",
    "options": [
      "b, c, e",
      "a, b, c",
      "b, d",
      "a, d"
    ],
    "answer": "b, d"
  },
  {
    "section": "Mathematics",
    "question_number": 61,
    "content": "Let \\(\\alpha, \\beta, \\gamma\\) be the three roots of the equation \\(x^{3}+bx+c=0\\). If \\(\\beta\\gamma=1=-\\alpha\\) then \\(b^{3}+2c^{3}-3\\alpha^{3}-6\\beta^{3}-8\\gamma^{3}\\) is equal to",
    "options": [
      "155/8",
      "21",
      "169/8",
      "19"
    ],
    "answer": "19"
  },
  {
    "section": "Mathematics",
    "question_number": 62,
    "content": "If for \\(z = \\alpha + i\\beta\\), \\(|z+2|=z+4(1+i)\\) then \\(\\alpha+\\beta\\) and \\(\\alpha\\beta\\) are the roots of the equation",
    "options": [
      "\\(x^{2}+3x-4=0\\)",
      "\\(x^{2}+7x+12=0\\)",
      "\\(x^{2}+x-12=0\\)",
      "\\(x^{2}+2x-3=0\\)"
    ],
    "answer": "\\(x^{2}+7x+12=0\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 63,
    "content": "The number of arrangements of the letters of the word \"INDEPENDENCE\" in which all the vowels always occur together is",
    "options": [
      "16800",
      "33600",
      "18000",
      "14800"
    ],
    "answer": "16800"
  },
  {
    "section": "Mathematics",
    "question_number": 64,
    "content": "The number of ways, in which 5 girls and 7 boys can be seated at a round table so that no two girls sit together is",
    "options": [
      "720",
      "\\(126(5!)^{2}\\)",
      "\\(7(360)^{2}\\)",
      "\\(7(720)^{2}\\)"
    ],
    "answer": "\\(126(5!)^{2}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 65,
    "content": "The largest natural number n such that \\(3^{n}\\) divides 66! is",
    "options": [],
    "answer": "31"
  },
  {
    "section": "Mathematics",
    "question_number": 66,
    "content": "Let \\(S_{K}=\\frac{1+2+...+K}{K}\\) and \\(\\sum_{j=1}^{n}S_{j}^{2}=\\frac{n}{A}(Bn^{2}+Cn+D)\\) where A, B, C, \\(D\\in N\\) and A has least value. Then",
    "options": [
      "\\(A+C+D\\) is not divisible by D",
      "\\(A+B=5(D-C)\\)",
      "\\(A+B+C+D\\) is divisible by 5",
      "\\(A+B\\) is divisible by D"
    ],
    "answer": "\\(A+B\\) is divisible by D"
  },
  {
    "section": "Mathematics",
    "question_number": 67,
    "content": "if the coefficients of three consecutive terms in the expansion of \\((1+x)^{n}\\) are the ratio 1:5:20 then the coefficient of the fourth term is",
    "options": [
      "2436",
      "5481",
      "1827",
      "3654"
    ],
    "answer": "3654"
  },
  {
    "section": "Mathematics",
    "question_number": 68,
    "content": "Let [t] denote the greatest integer \\(\\le t.\\) if the constant term in the expansion of \\((3x^{2}-\\frac{1}{2x^{5}})^{7}\\) is \\(\\alpha\\) then [\\(\\alpha\\)] is equal to",
    "options": [],
    "answer": "0"
  },
  {
    "section": "Mathematics",
    "question_number": 69,
    "content": "Let \\(C(\\alpha,\\beta)\\) be the circumcentre of the triangle formed by the lines \\(4x+3y=69,\\) \\(4y-3x=17,\\) and \\(x+7y=61.\\) Then \\((\\alpha-\\beta)^{2}+\\alpha+\\beta\\) is equal to",
    "options": [
      "18",
      "17",
      "15",
      "16"
    ],
    "answer": "17"
  },
  {
    "section": "Mathematics",
    "question_number": 70,
    "content": "Consider a circle \\(C_{1}:x^{2}+y^{2}-4x-2y=\\alpha-5\\). Let its mirror image in the line \\(y=2x+1\\) be another circle \\(C_{2}:5x^{2}+5y^{2}-10fx-10gy+36=0.\\) Let r be the radius of \\(C_{2}\\). Then \\(\\alpha+r\\) is equal to",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 71,
    "content": "Let R be the focus of the parabola \\(y^{2}=20x\\) and the line \\(y=mx+c\\) intersect the parabola at two points P and Q. Let the points \\(G(10,10)\\) be the centroid of the triangle PQR. If \\(c-m=6,\\) then \\(PQ^{2}\\) is",
    "options": [
      "296",
      "325",
      "317",
      "346"
    ],
    "answer": "317"
  },
  {
    "section": "Mathematics",
    "question_number": 72,
    "content": "\\(\\lim_{x\\rightarrow0}((\\frac{1-cos^{2}(3x)}{cos^{3}(4x)})(\\frac{sin^{3}(4x)}{(log_{e}(2x+1))^{5}}))\\) is equal to",
    "options": [
      "15",
      "9",
      "18",
      "24"
    ],
    "answer": "9"
  },
  {
    "section": "Mathematics",
    "question_number": 73,
    "content": "Negation of \\((p\\rightarrow q)\\rightarrow(q\\rightarrow p)\\) is",
    "options": [
      "\\((-p)\\vee p\\)",
      "\\(q\\wedge(\\neg p)\\)",
      "\\((-q)\\wedge p\\)",
      "\\(p\\vee(-q)\\)"
    ],
    "answer": "\\(q\\wedge(\\neg p)\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 74,
    "content": "Let the mean and variance of 8 numbers x, y, 10, 12, 6, 12, 4, 8 be 9 and 9.25 respectively. If \\(x>y,\\) then \\(3x-2y\\) is equal to",
    "options": [],
    "answer": "25"
  },
  {
    "section": "Mathematics",
    "question_number": 75,
    "content": "Let the number of elements in sets A and B be five and two respectively. Then the number of subsets of \\(A\\times B\\) each having at least 3 and at most 6 elements is",
    "options": [
      "752",
      "782",
      "792",
      "772"
    ],
    "answer": "792"
  },
  {
    "section": "Mathematics",
    "question_number": 76,
    "content": "Let \\(A=\\{0,3,4,6,7,8,9,10\\}\\) and R be the relation defined on A such that \\(R=\\{(x,y)\\in A\\times A:x-y\\) is odd positive integer or \\(x-y=2\\}\\). The minimum number of elements that must be added to the relation R, so that it is a symmetric relation, is equal to",
    "options": [],
    "answer": "19"
  },
  {
    "section": "Mathematics",
    "question_number": 77,
    "content": "Let \\(A=[\\begin{matrix}2&1&0\\\\1&2&-1\\\\0&-1&2\\end{matrix}]\\). If \\(|adj(adj(adj~2A))|=(16)^{n}\\), then n is equal to",
    "options": [
      "8",
      "10",
      "9",
      "12"
    ],
    "answer": "8"
  },
  {
    "section": "Mathematics",
    "question_number": 78,
    "content": "Let \\(P=[\\begin{matrix}\\frac{\\sqrt{3}}{2}&\\frac{1}{2}\\\\ -\\frac{1}{2}&\\frac{\\sqrt{3}}{2}\\end{matrix}]\\), \\(A=[\\begin{matrix}1&1\\\\0&1\\end{matrix}]\\) and \\(Q=PAP^{T}\\). If \\(P^{T}Q^{2007}P=[\\begin{matrix}a&b\\\\c&d\\end{matrix}]\\) then \\(2a+b-3c-4d\\) is equal to",
    "options": [
      "2004",
      "2005",
      "2007",
      "2006"
    ],
    "answer": "2004"
  },
  {
    "section": "Mathematics",
    "question_number": 79,
    "content": "Let \\(f(x)=\\frac{sin~x+cos~x-\\sqrt{2}}{sin~x-cos~x}\\), \\(x\\in[0,\\pi]-\\{\\frac{\\pi}{4}\\}\\), then \\(f(\\frac{7\\pi}{12})f''(\\frac{7\\pi}{12})\\) is equal to",
    "options": [
      "\\(\\frac{2}{9}\\)",
      "\\(\\frac{-2}{3}\\)",
      "\\(\\frac{-1}{3\\sqrt{3}}\\)",
      "\\(\\frac{2}{3\\sqrt{3}}\\)"
    ],
    "answer": "\\(\\frac{-2}{3}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 80,
    "content": "If \\(a_{\\alpha}\\) is the greatest term in the sequence \\(a_{n}=\\frac{n^{3}}{n^{4}+147}\\) \\(n=1,2,3....\\) then \\(\\alpha\\) is equal to",
    "options": [],
    "answer": "7"
  },
  {
    "section": "Mathematics",
    "question_number": 81,
    "content": "Let \\(I(x)=\\int\\frac{x+1}{x(1+xe^{x})^{2}}dx\\), \\(x>0\\). If \\(\\lim_{x\\rightarrow\\infty}I(x)=0\\) then \\(I(1)\\) is equal to",
    "options": [
      "\\(\\frac{e+2}{e+1}-log_{e}(e+1)\\)",
      "\\(\\frac{e+1}{e+2}+log_{e}(e+1)\\)",
      "\\(\\frac{e+1}{e+2}-log_{e}(e+1)\\)",
      "\\(\\frac{e+2}{e+1}+log_{e}(e+1)\\)"
    ],
    "answer": "\\(\\frac{e+1}{e+2}-log_{e}(e+1)\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 82,
    "content": "Let [t] denote the greatest integer \\(\\le t.\\) Then \\(\\frac{2}{\\pi}\\int_{\\frac{\\pi}{6}}^{\\frac{5\\pi}{6}}(8[cosec~x]-5[cot~x])dx\\) is equal to",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Mathematics",
    "question_number": 83,
    "content": "The area of the region \\(\\{(x,y):x^{2}\\le y\\le8-x^{2},y\\le7\\}\\) is",
    "options": [
      "27",
      "18",
      "20",
      "21"
    ],
    "answer": "20"
  },
  {
    "section": "Mathematics",
    "question_number": 84,
    "content": "If the solution curve of the differential equation \\((y-2~log_{e}x)dx+(x~log_{e}x^{2})dy=0,\\) \\(x>1\\) passes through the points \\((e,\\frac{4}{3})\\) and \\((e^{4},\\alpha).\\) then \\(\\alpha\\) is equal to",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Mathematics",
    "question_number": 85,
    "content": "If the points with position vectors \\(\\alpha\\hat{i}+10\\hat{j}+13\\hat{k}\\), \\(6\\hat{i}+11\\hat{j}+11\\hat{k}\\), \\(\\frac{9}{2}\\hat{i}+\\beta\\hat{j}-8\\hat{k}\\) are collinear, then \\((19\\alpha-6\\beta)^{2}\\) is equal to",
    "options": [
      "36",
      "25",
      "49",
      "16"
    ],
    "answer": "36"
  },
  {
    "section": "Mathematics",
    "question_number": 86,
    "content": "Let \\(\\vec{a}=6\\hat{i}+9\\hat{j}+12\\hat{k},\\) \\(\\vec{b}=\\alpha\\hat{i}+11\\hat{j}-2\\hat{k}\\) and \\(\\vec{c}\\) be vectors such that \\(\\vec{a}\\times\\vec{c}=\\vec{a}\\times\\vec{b}\\). If \\(\\vec{a}\\cdot\\vec{c}=-12\\) and \\(\\vec{c}\\cdot(\\hat{i}-2\\hat{j}+\\hat{k})=5\\) then \\(\\vec{c}\\cdot(\\hat{i}+\\hat{j}+\\hat{k})\\) is equal to",
    "options": [],
    "answer": "11"
  },
  {
    "section": "Mathematics",
    "question_number": 87,
    "content": "The shortest distance between the lines \\(\\frac{x-4}{4}=\\frac{y+2}{5}=\\frac{z+3}{3}\\) and \\(\\frac{x-1}{3}=\\frac{y-3}{4}=\\frac{z-4}{2}\\) is",
    "options": [
      "\\(6\\sqrt{3}\\)",
      "\\(2\\sqrt{6}\\)",
      "\\(6\\sqrt{2}\\)",
      "\\(3\\sqrt{6}\\)"
    ],
    "answer": "\\(3\\sqrt{6}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 88,
    "content": "If the equation of the plane containing the line \\(x+2y+3z-4=0=2x+y-z+5\\) and perpendicular to the plane \\(\\vec{r}=(\\hat{i}-\\hat{j})+\\lambda(\\hat{i}+\\hat{j}+\\hat{k})+\\mu(\\hat{i}-2\\hat{j}+3\\hat{k})\\) is \\(ax+by+cz=4\\) then \\((a-b+c)\\) is equal to",
    "options": [
      "18",
      "22",
      "20",
      "24"
    ],
    "answer": "20"
  },
  {
    "section": "Mathematics",
    "question_number": 89,
    "content": "Let \\(\\lambda_{1}\\), \\(\\lambda_{2}\\) be the values of \\(\\lambda\\) for which the points \\((\\frac{5}{2},1,\\lambda)\\) and \\((-2,0,1)\\) are at equal distance from the plane \\(2x+3y-6z+7\\). If \\(\\lambda_{1}>\\lambda_{2}\\) then the distance of the point \\((\\lambda_{1}-\\lambda_{2},\\lambda_{2},\\lambda_{1})\\) from the line \\(\\frac{x-5}{1}=\\frac{y-1}{2}=\\frac{z+7}{2}\\) is",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Mathematics",
    "question_number": 90,
    "content": "In a bolt factory, machines A, B and C manufacture respectively 20%, 30% and 50% of the total bolts. Of their output 3, 4 and 2 percent are respectively defective bolts. A bolt is drawn at random from the product. If the bolt drawn is found the defective then the probability that it is manufactured by the machine C is",
    "options": [
      "\\(\\frac{5}{14}\\)",
      "\\(\\frac{9}{28}\\)",
      "\\(\\frac{3}{7}\\)",
      "\\(\\frac{2}{7}\\)"
    ],
    "answer": "\\(\\frac{5}{14}\\)"
  }], 

  6:[
  {
    "section": "Physics",
    "content": "Match List I with List II\nList I\nA. Torque\nB. Stress\nC. Pressure gradient\nD. Coefficient of viscosity\n\nList II\nI. $M L^{-2}T^{-2}$\nII. $M L^{2}T^{-2}$\nIII. $M L^{-1}T^{-1}$\nIV. $M L^{-1}T^{-2}$<br><div class='flex justify-center my-4'><img src='images/6/q1.png' alt='Question 1'></div>",
    "options": [
      "A-II, B-I, C-IV, D-III",
      "A-IV, B-II, C-III, D-I",
      "A-II, B-IV, C-I, D-III",
      "A-III, B-IV, C-I, D-II"
    ],
    "answer": "A-II, B-IV, C-I, D-III"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements:\nStatement I: Area under velocity-time graph gives the distance travelled by the body in a given time.\nStatement II: Area under acceleration-time graph is equal to the change in velocity in the given time.\nIn the light of given statements, choose the correct answer from the options given below.",
    "options": [
      "Both Statement I and Statement II are true",
      "Both Statement I and Statement II are false",
      "Statement I is correct but Statement II is false",
      "Statement I is incorrect but Statement II is true"
    ],
    "answer": "Statement I is incorrect but Statement II is true"
  },
  {
    "section": "Physics",
    "content": "The trajectory of projectile, projected from the ground is given by $y=x-\\frac{x^{2}}{20}$. Where x and y are measured in meter. The maximum height attained by the projectile will be.",
    "options": [
      "200 m",
      "10 m",
      "5 m",
      "10\\sqrt{2} m"
    ],
    "answer": "5 m"
  },
  {
    "section": "Physics",
    "content": "A bullet of mass 0.1 kg moving horizontally with speed $400~m~s^{-1}$ hits a wooden block of mass 3.9 kg kept on a horizontal rough surface. The bullet gets embedded into the block and moves 20 m before coming to rest. The coefficient of friction between the block and the surface is",
    "options": [
      "0.90",
      "0.50",
      "0.65",
      "0.25"
    ],
    "answer": "0.25"
  },
  {
    "section": "Physics",
    "content": "A body of mass 5 kg is moving with a momentum of $100~kg~m~s^{-1}$. Now a force of 2 N acts on the body in the direction of its motion for 5 s. The increase in the Kinetic energy of the body is ____ J.",
    "options": [],
    "answer": "30"
  },
  {
    "section": "Physics",
    "content": "A hollow spherical ball of uniform density rolls up a curved surface with an initial velocity $3~m~s^{-1}$ (as shown in figure). Maximum height with respect to the initial position covered by it will be ____ cm (take, $g=10~m~s^{-2})$<br><div class='flex justify-center my-4'><img src='images/6/q6.png' alt='Question 6'></div>",
    "options": [],
    "answer": "75"
  },
  {
    "section": "Physics",
    "content": "The orbital angular momentum of a satellite is L, when it is revolving in a circular orbit at height h from earth surface. If the distance of satellite from the earth centre is increased by eight times to its initial value, then the new angular momentum will be",
    "options": [
      "8 L",
      "9 L",
      "4 L",
      "3 L"
    ],
    "answer": "3 L"
  },
  {
    "section": "Physics",
    "content": "The acceleration due to gravity at height h above the earth if $h\\ll R$ (Radius of earth) is given by",
    "options": [
      "$g'=g(1-\\frac{h^{2}}{2R^{2}})$",
      "$g'=g(1-\\frac{h}{2R})$",
      "$g'=g(1-\\frac{2h}{R})$",
      "$g'=g(1-\\frac{2h^{2}}{R^{2}})$"
    ],
    "answer": "$g'=g(1-\\frac{2h}{R})$"
  },
  {
    "section": "Physics",
    "content": "A hydraulic automobile lift is designed to lift vehicles of mass 5000 kg. The area of cross section of the cylinder carrying load is $250~cm^{2}.$ The maximum pressure the smaller piston would have to bear is [Assume $g=10~m~s^{-2}$]<br><div class='flex justify-center my-4'><img src='images/6/q9.png' alt='Question 9'></div>",
    "options": [
      "20 \\times 10^{6} Pa",
      "2 \\times 10^{5} Pa",
      "200 \\times 10^{6} Pa",
      "2 \\times 10^{6} Pa"
    ],
    "answer": "2 \\times 10^{5} Pa"
  },
  {
    "section": "Physics",
    "content": "A steel rod of length 1 m and cross-sectional area $10^{-4}m^{2}$ is heated from $0^{\\circ}C$ to $200^{\\circ}C$ without being allowed to extend or bend. The compressive tension produced in the rod is ____ $\\times10^{4}N$ (Given Young's modulus of steel $=2\\times10^{11}N~m^{-2}$, coefficient of linear expansion $=10^{-5}K^{-1})$",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Physics",
    "content": "Work done by a Carnot engine operating between temperatures $127^{\\circ}C$ and $27^{\\circ}C$ is 2 kJ. The amount of heat transferred to the engine by the reservoir is:",
    "options": [
      "8 kJ",
      "2.67 kJ",
      "2 kJ",
      "4 kJ"
    ],
    "answer": "8 kJ"
  },
  {
    "section": "Physics",
    "content": "The temperature at which the kinetic energy of oxygen molecules becomes double than its value at $27^{\\circ}C$ is",
    "options": [
      "927^{\\circ}C",
      "327^{\\circ}C",
      "1227^{\\circ}C",
      "627^{\\circ}C"
    ],
    "answer": "327^{\\circ}C"
  },
  {
    "section": "Physics",
    "content": "For particle P revolving round the centre O with radius of circular path r and regular velocity w, as shown in below figure, the projection of OP on the x-axis at time t is<br><div class='flex justify-center my-4'><img src='images/6/q13.png' alt='Question 13'></div>",
    "options": [
      "$x(t)=r~cos(\\omega t-\\frac{\\pi}{6})$",
      "$x(t)=r~cos(\\omega t+\\frac{\\pi}{6})$",
      "$x(t)=r~sin(\\omega t+\\frac{\\pi}{6})$",
      "$x(t)=r~cos(\\omega t)$"
    ],
    "answer": "$x(t)=r~cos(\\omega t+\\frac{\\pi}{6})$"
  },
  {
    "section": "Physics",
    "content": "A guitar string of length 90 cm vibrates with a fundamental frequency of 120 Hz. The length of the string producing a fundamental of 180 Hz will be ____ cm",
    "options": [],
    "answer": "60"
  },
  {
    "section": "Physics",
    "content": "Electric potential at a point P due to a point charge of $5\\times10^{-9}C$ is 50 V. The distance of P from the point charge is: (Assume, $\\frac{1}{4\\pi\\epsilon_{0}}=9\\times10^{9}N~m^{2}C^{-2})$",
    "options": [
      "9 cm",
      "3 cm",
      "0.9 cm",
      "90 cm"
    ],
    "answer": "90 cm"
  },
  {
    "section": "Physics",
    "content": "A 600 pF capacitor is charged by 200 V supply. It is then disconnected from the supply and is connected to another uncharged 600 pF capacitor. Electrostatic energy lost in the process is ____ $\\mu J$.",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Physics",
    "content": "The equivalent resistance between A and B as shown in figure is:<br><div class='flex justify-center my-4'><img src='images/6/q17.png' alt='Question 17'></div>",
    "options": [
      "10 kΩ",
      "5 kΩ",
      "20 kΩ",
      "30 kΩ"
    ],
    "answer": "5 kΩ"
  },
  {
    "section": "Physics",
    "content": "The number density of free electrons in copper is nearly $8\\times10^{28}m^{-3}$ A copper wire has its area of cross-section $=2\\times10^{-6}m^{2}$ and is carrying a current of 3.2 A. The drift speed of the electrons is ____ $\\times10^{-6}ms^{-1}$",
    "options": [],
    "answer": "125"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R.\nAssertion A: Electromagnets are made of soft iron.\nReason R: Soft iron has high permeability and low retentivity.\nIn the light of above statements, choose the most appropriate answer from the options given below.",
    "options": [
      "A is not correct but R is correct",
      "A is correct but R is not correct",
      "Both A and R are correct and R is the correct explanation of A",
      "Both A and R are correct but R is NOT the correct explanation of A"
    ],
    "answer": "Both A and R are correct and R is the correct explanation of A"
  },
  {
    "section": "Physics",
    "content": "The ratio of magnetic field at the centre of a current carrying coil of radius r to the magnetic field at distance r from the centre of coil on its axis is $\\sqrt{x}$ : 1. The value of x is<br><div class='flex justify-center my-4'><img src='images/6/q20.png' alt='Question 20'></div>",
    "options": [],
    "answer": "8"
  },
  {
    "section": "Physics",
    "content": "An emf of 0.08 V is induced in a metal rod of length 10 cm held normal to a uniform magnetic field of 0.4 T, when move with a velocity of:",
    "options": [
      "0.5 m s-1",
      "20 m s-1",
      "3.2 m s-1",
      "2 m s-1"
    ],
    "answer": "2 m s-1"
  },
  {
    "section": "Physics",
    "content": "A series combination of resistor of resistance 100 Ω inductor of inductance 1 H and capacitor of capacitance 6.25 µF is connected to an ac source. The quality factor of the circuit will be",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Physics",
    "content": "The waves emitted when a metal target is bombarded with high energy electrons are",
    "options": [
      "Microwaves",
      "Infrared rays",
      "X-rays",
      "Radio Waves"
    ],
    "answer": "X-rays"
  },
  {
    "section": "Physics",
    "content": "Two transparent media having refractive indices 1.0 and 1.5 are separated by a spherical refracting surface of radius of curvature 30 cm. The centre of curvature of surface is towards denser medium and a point object is placed on the principal axis in rarer medium at a distance of 15 cm from the pole of the surface. The distance of image from the pole of the surface is ____ cm.",
    "options": [],
    "answer": "30"
  },
  {
    "section": "Physics",
    "content": "The width of fringe is 2 mm on the screen in a double slit experiment for the light of wavelength of 400 nm. The width of the fringe for the light of wavelength 600 nm will be:",
    "options": [
      "4 mm",
      "2 mm",
      "1.33 mm",
      "3 mm"
    ],
    "answer": "3 mm"
  },
  {
    "section": "Physics",
    "content": "In photoelectric effect\nA. The photocurrent is proportional to the intensity of the incident radiation.\nB. Maximum kinetic energy... depends on intensity.\nC. Max K.E... depends on frequency.\nD. Threshold intensity required.\nE. Max K.E independent of frequency.",
    "options": [
      "A and B only",
      "A and E only",
      "A and C only",
      "B and C only"
    ],
    "answer": "A and C only"
  },
  {
    "section": "Physics",
    "content": "The ratio of wavelength of spectral lines $H_{\\alpha}$ and $H_{\\beta}$ in the Balmer series is $\\frac{x}{20}$. The value of x is",
    "options": [],
    "answer": "27"
  },
  {
    "section": "Physics",
    "content": "A radioactive material is reduced to 1/8 of its original amount in 3 days. If $8\\times10^{-3}$ kg of the material is left after 5 days the initial amount of the material is",
    "options": [
      "40 g",
      "32 g",
      "64 g",
      "256 g"
    ],
    "answer": "256 g"
  },
  {
    "section": "Physics",
    "content": "For a given transistor amplifier circuit in CE configuration $V_{CC}=1~V$, $R_{C}=1~k\\Omega$, $R_{b}=100~k\\Omega$ and $\\beta=100$ Value of base current $I_{b}$<br><div class='flex justify-center my-4'><img src='images/6/q29.png' alt='Question 29'></div>",
    "options": [
      "$I_{b}=1.0~\\mu A$",
      "$I_{b}=0.1~\\mu A$",
      "$I_{b}=100~\\mu A$",
      "$I_{b}=10~\\mu A$"
    ],
    "answer": "$I_{b}=10~\\mu A$"
  },
  {
    "section": "Physics",
    "content": "The power radiated from a linear antenna of length l is proportional to (Given, $\\lambda=$ Wavelength of wave):",
    "options": [
      "$\\frac{l}{\\lambda}$",
      "$(\\frac{l}{\\lambda})^{2}$",
      "$\\frac{l}{\\lambda^{2}}$",
      "$\\frac{l^{2}}{\\lambda}$"
    ],
    "answer": "$(\\frac{l}{\\lambda})^{2}$"
  },
  {
    "section": "Chemistry",
    "content": "Which of the following have same number of significant figures?\n(A) 0.00253\n(B) 1.0003\n(C) 15.0\n(D) 163",
    "options": [
      "A, B and C only",
      "C and D only",
      "B and C only",
      "A, C and D only"
    ],
    "answer": "A, C and D only"
  },
  {
    "section": "Chemistry",
    "content": "Henry Moseley studied characteristic X-ray spectra of elements. The graph which represents his observation correctly is<br><div class='flex justify-center my-4'><img src='images/6/q32.png' alt='Question 32'></div>",
    "options": [
      "Graph 1",
      "Graph 2",
      "Graph 3",
      "Graph 4"
    ],
    "answer": "Graph 3"
  },
  {
    "section": "Chemistry",
    "content": "The number of atomic orbitals from the following having 5 radial nodes is\n7s, 7p, 6s, 8p, 8d",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "content": "The number of species from the following carrying a single lone pair on central atom Xenon is\n$XeF_{5}^{+}$, $XeO_{3}$, $XeO_{2}F_{2}$, $XeF_{5}^{-}$, $XeO_{3}F_{2}$, $XeOF_{4}$, $XeF_{4}$",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "content": "Arrange the following gases in increasing order of van der Waals constant 'a'\n(A) Ar\n(B) $CH_{4}$\n(C) $H_{2}O$\n(D) $C_{6}H_{6}$",
    "options": [
      "D, C, B and A",
      "B, C, D and A",
      "C, D, B and A",
      "A, B, C and D"
    ],
    "answer": "A, B, C and D"
  },
  {
    "section": "Chemistry",
    "content": "For complete combustion of ethene,\n$C_{2}H_{4}(g)+3O_{2}(g)\\rightarrow2CO_{2}(g)+2H_{2}O(l)$\nthe amount of heat produced as measured in bomb calorimeter is 1406 kJ mol-1 at 300 K. The minimum value of $T\\Delta S$ needed to reach equilibrium is (-) kJ.",
    "options": [],
    "answer": "1411"
  },
  {
    "section": "Chemistry",
    "content": "The incorrect statements from the following is:\nA. The electrical work... is equal to reaction Gibbs energy.\nB. $E_{cell}^{\\circ}$ is dependent on the pressure.\nC. $\\frac{dE_{cell}}{dT}=\\frac{\\Delta_{r}S}{nF}$\nD. A cell is operating reversibly...",
    "options": [
      "A only",
      "B only",
      "C only",
      "D only"
    ],
    "answer": "B only"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements:\nStatement-I: Methyl orange is a weak acid.\nStatement-II: The benzenoid form of methyl orange is more intense/deeply coloured than the quinonoid form.",
    "options": [
      "Both Statement-I and Statement-II are incorrect",
      "Statement-I is incorrect but Statement-II is correct",
      "Both Statement-I and Statement-II are correct",
      "Statement-I is correct but Statement-II is incorrect"
    ],
    "answer": "Statement-I is correct but Statement-II is incorrect"
  },
  {
    "section": "Chemistry",
    "content": "The solubility product of $BaSO_{4}$ is $1\\times10^{-10}$ at 298 K. The solubility of $BaSO_{4}$ in 0.1M $K_{2}SO_{4}(aq)$ solution is ____ $\\times10^{-9}$ g $L^{-1}$",
    "options": [],
    "answer": "233"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements regarding indicators in titration.",
    "options": [
      "Statement I is correct but Statement II is incorrect",
      "Both Statement I and Statement II are incorrect",
      "Statement I is incorrect but Statement II is correct",
      "Both Statement I and Statement II are correct"
    ],
    "answer": "Statement I is correct but Statement II is incorrect"
  },
  {
    "section": "Chemistry",
    "content": "Which of the following can reduce decomposition of $H_{2}O_{2}$ on exposure to light",
    "options": [
      "Urea",
      "Alkali",
      "Glass containers",
      "Dust"
    ],
    "answer": "Urea"
  },
  {
    "section": "Chemistry",
    "content": "For a good quality cement, the ratio of lime to the total of the oxides of Si, Al and Fe should be as close as to",
    "options": [
      "4",
      "1",
      "2",
      "3"
    ],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: One is labelled as Assertion A and the other is labelled as Reason R\nAssertion A: Sodium is about 30 times as abundant as potassium in the oceans.\nReason R: Potassium is bigger in size than sodium.",
    "options": [
      "Both A and R are true and R is the correct explanation of A",
      "A is true but R is false",
      "Both A and R are true but R is NOT the correct explanation of A",
      "Both A and R are false"
    ],
    "answer": "Both A and R are true but R is NOT the correct explanation of A"
  },
  {
    "section": "Chemistry",
    "content": "The descending order of acidity for the following carboxylic acid is:\n(A) $CH_{3}COOH$\n(B) $F_{3}C-COOH$\n(C) $ClCH_{2}-COOH$\n(D) $FCH_{2}-COOH$\n(E) $BrCH_{2}-COOH$",
    "options": [
      "B > C > D > E > A",
      "E > D > B > A > C",
      "B > D > C > E > A",
      "D > B > A > E > C"
    ],
    "answer": "B > D > C > E > A"
  },
  {
    "section": "Chemistry",
    "content": "The correct IUPAC nomenclature for the following compound is:<br><div class='flex justify-center my-4'><img src='images/6/q45.png' alt='Question 45'></div>",
    "options": [
      "2-Methyl-5-oxohexanoic acid",
      "2-Formyl-5-methylhexan-6-oic acid",
      "5-Methyl-2-oxohexan-6-oic acid",
      "5-Formyl-2-methylhexanoic acid"
    ],
    "answer": "2-Methyl-5-oxohexanoic acid"
  },
  {
    "section": "Chemistry",
    "content": "Which of these reactions is not a part of breakdown of ozone in stratosphere?",
    "options": [
      "$2\\tilde{C}lO(g)\\rightarrow ClO_{2}(g)+\\tilde{C}l(g)$",
      "$ClO(g)+O(g)\\rightarrow O_{2}(g)+\\tilde{C1}$",
      "$\\tilde{C}l(g)+O_{3}(g)\\rightarrow O_{2}(g)+ClO(g)$",
      "$CF_{2}Cl_{2}(g)\\rightarrow\\tilde{C}l(g)+\\tilde{C}F_{2}Cl(g)$"
    ],
    "answer": "$2\\tilde{C}lO(g)\\rightarrow ClO_{2}(g)+\\tilde{C}l(g)$"
  },
  {
    "section": "Chemistry",
    "content": "If the boiling points of two solvents X and Y (having same molecular weights) are in the ratio 2: 1 and their enthalpy of vaporizations are in the ratio 1: 2, then the boiling point elevation constant of X is m times the boiling point elevation constant of Y. The value of m is",
    "options": [],
    "answer": "8"
  },
  {
    "section": "Chemistry",
    "content": "The correct reaction profile diagram for a positive catalyst reaction.<br><div class='flex justify-center my-4'><img src='images/6/q48.png' alt='Question 48'></div>",
    "options": [
      "Graph 1",
      "Graph 2",
      "Graph 3",
      "Graph 4"
    ],
    "answer": "Graph 3"
  },
  {
    "section": "Chemistry",
    "content": "The statement/s which are true about antagonists from the following is/are:\nA. They bind to the receptor site.\nB. Get transferred inside the cell for their action.\nC. Inhibit the natural communication of the body.\nD. Mimic the natural messenger.",
    "options": [
      "B only",
      "A, C and D",
      "A and C",
      "A and B"
    ],
    "answer": "A and C"
  },
  {
    "section": "Chemistry",
    "content": "Coagulating value of the electrolytes $AlCl_{3}$ and NaCl for $As_{2}S_{3}$ are 0.09 and 50.04 respectively. The coagulating power of $AlCl_{3}$ is x times the coagulating power of NaCl. The value of x is",
    "options": [],
    "answer": "556"
  },
  {
    "section": "Chemistry",
    "content": "In Hall-Heroult process, the following is used for reducing $Al_{2}O_{3}$:",
    "options": [
      "Magnesium",
      "$Na_{3}AlF_{6}$",
      "Graphite",
      "$CaF_{2}$"
    ],
    "answer": "Graphite"
  },
  {
    "section": "Chemistry",
    "content": "The ratio of sigma and pi bonds present in pyrophosphoric acid is",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Chemistry",
    "content": "Match List-I with List-II\nLIST-I (Coordination Complex)\nA. $[Cr(CN)_{6}]^{3-}$\nB. $[Fe(H_{2}O)_{6}]^{2+}$\nC. $[Co(NH_{3})_{6}]^{3+}$\nD. $[Ni(NH_{3})_{6}]^{2+}$\n\nLIST-II (Number of unpaired electrons)\nI. 0\nII. 3\nIII. 2\nIV. 4",
    "options": [
      "A-II, B-IV, C-I, D-III",
      "A-III, B-IV, C-I, D-II",
      "A-II, B-I, C-IV, D-III",
      "A-IV, B-III, C-II, D-I"
    ],
    "answer": "A-II, B-IV, C-I, D-III"
  },
  {
    "section": "Chemistry",
    "content": "The observed magnetic moment of the complex $[Mn(NCS)_{6}]^{x-}$ is 6.06 BM. The numerical value of x is",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "content": "The sum of oxidation state of the metals in $Fe(CO)_{5}$, $VO^{2+}$ and $WO_{3}$ is",
    "options": [],
    "answer": "10"
  },
  {
    "section": "Chemistry",
    "content": "The correct order of reactivity of following haloarenes towards nucleophilic substitution with aqueous NaOH is:<br><div class='flex justify-center my-4'><img src='images/6/q56.png' alt='Question 56'></div>",
    "options": [
      "A > B > D > C",
      "C > A > D > B",
      "D > C > B > A",
      "D > B > A > C"
    ],
    "answer": "D > B > A > C"
  },
  {
    "section": "Chemistry",
    "content": "A compound /X/ when treated with phthalic anhydride in presence of concentrated $H_{2}SO_{4}$ yields /Y/. /Y/ is used as an acid/base indicator. /X/ and /Y/ are respectively",
    "options": [
      "Anisole, methyl orange",
      "Salicylaldehyde, Phenolphthalein",
      "Toludine, Phenolphthalein",
      "Carbolic acid, Phenolphthalein"
    ],
    "answer": "Carbolic acid, Phenolphthalein"
  },
  {
    "section": "Chemistry",
    "content": "Major product /P/ formed in the following reaction is<br><div class='flex justify-center my-4'><img src='images/6/q58.png' alt='Question 58'></div>",
    "options": [
      "Structure 1",
      "Structure 2",
      "Structure 3",
      "Structure 4"
    ],
    "answer": "Structure 4"
  },
  {
    "section": "Chemistry",
    "content": "The product (P) formed from the following multistep reaction is:<br><div class='flex justify-center my-4'><img src='images/6/q59.png' alt='Question 59'></div>",
    "options": [
      "Structure 1",
      "Structure 2",
      "Structure 3",
      "Structure 4"
    ],
    "answer": "Structure 4"
  },
  {
    "section": "Chemistry",
    "content": "Match List I with List II regarding Natural amino acids and One Letter Codes.",
    "options": [
      "(A)-III, B-IV, (C)-I, (D)-II",
      "(A)-IV, B-III, (C)-I, (D)-II",
      "(A)-III, B-I, (C)-IV, (D)-II",
      "(A)-II, B-I, (C)-IV, (D)-III"
    ],
    "answer": "(A)-III, B-I, (C)-IV, (D)-II"
  },
  {
    "section": "Mathematics",
    "content": "Let m and n be the numbers of real roots of the quadratic equations $x^{2}-12x+[x]+31=0$ and $x^{2}-5|x+2|-4=0$ respectively. Then $m^{2}+mn+n^{2}$ is equal to",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Mathematics",
    "content": "Let $A=\\{\\theta\\in(0,2\\pi):\\frac{1+2i~sin~\\theta}{1-i~sin~\\theta}$ is purely imaginary\\}. Then the sum of the elements in A is",
    "options": [
      "4π",
      "3π",
      "π",
      "2π"
    ],
    "answer": "3π"
  },
  {
    "section": "Mathematics",
    "content": "If the number of words... using all letters of MATHEMATICS in which C and S do not come together, is (6!)k then k is equal to",
    "options": [
      "2835",
      "5670",
      "1890",
      "945"
    ],
    "answer": "1890"
  },
  {
    "section": "Mathematics",
    "content": "Let $a_{n}$ be $n^{th}$ term of the series $5+8+14+23+35+50+......$ and $S_{n}=\\sum a_{k}$. Then $S_{30}-a_{40}$ is equal to",
    "options": [
      "11310",
      "11260",
      "11290",
      "11280"
    ],
    "answer": "11280"
  },
  {
    "section": "Mathematics",
    "content": "Let $0<z<y<x$ be three real numbers such that $\\frac{1}{x}, \\frac{1}{y}, \\frac{1}{z}$ are in AP and x, $\\sqrt{2}y$, z are in GP. If $xy+yz+zx=\\frac{3}{\\sqrt{2}}xyz,$ then $3(x+y+z)^{2}$ is equal to",
    "options": [
      "54",
      "18",
      "27",
      "36"
    ],
    "answer": "27"
  },
  {
    "section": "Mathematics",
    "content": "The absolute difference of the coefficients of $x^{10}$ and $x^{7}$ in the expansion of $(2x^{2}+\\frac{1}{2x})^{11}$ is equal to",
    "options": [
      "$13^{3}-13$",
      "$11^{3}-11$",
      "$10^{3}-10$",
      "$12^{3}-12$"
    ],
    "answer": "$12^{3}-12$"
  },
  {
    "section": "Mathematics",
    "content": "$25^{190}-19^{190}-8^{190}+2^{190}$ is divisible by",
    "options": [
      "neither 14 nor 34",
      "14 but not by 34",
      "34 but not by 14",
      "both 14 and 34"
    ],
    "answer": "neither 14 nor 34"
  },
  {
    "section": "Mathematics",
    "content": "The value of $36(4~cos^{2}9^{\\circ}-1)(4~cos^{2}27^{\\circ}-1)(4~cos^{2}81^{\\circ}-1)(4~cos^{2}243^{\\circ}-1)$ is",
    "options": [
      "18",
      "54",
      "36",
      "9"
    ],
    "answer": "36"
  },
  {
    "section": "Mathematics",
    "content": "Let A(0,1), B(1,1) and C(1,0) be the mid-points of the sides of a triangle with incentre at the point D. If the focus of the parabola $y^{2}=4ax$ passing through D is $(\\alpha+\\beta\\sqrt{2},0)$, then $\\frac{\\alpha}{\\beta^{2}}$ is equal to",
    "options": [
      "8",
      "12",
      "6",
      "9/2"
    ],
    "answer": "6"
  },
  {
    "section": "Mathematics",
    "content": "Let O be the origin and OP and OQ be the tangents to the circle... If the circumcircle of triangle OPQ passes through $(a,\\frac{1}{2})$, then a value of a is",
    "options": [
      "3/2",
      "-1/2",
      "5/2",
      "1"
    ],
    "answer": "-1/2"
  },
  {
    "section": "Mathematics",
    "content": "The ordinates of the points P and Q on the parabola... are in ratio 3:1... $\\frac{\\beta^{2}}{\\alpha}$ is equal to",
    "options": [
      "20",
      "16",
      "25",
      "110"
    ],
    "answer": "110"
  },
  {
    "section": "Mathematics",
    "content": "If $\\alpha>\\beta>0$ are the roots of $ax^{2}+bx+1=0$ and limit... then k is equal to",
    "options": [
      "$2\\beta$",
      "$\\alpha$",
      "$2\\alpha$",
      "$\\beta$"
    ],
    "answer": "$\\alpha$"
  },
  {
    "section": "Mathematics",
    "content": "The negation of $(p\\wedge(-q))\\vee(-p)$ is equivalent to",
    "options": [
      "$p\\wedge(-q)$",
      "$p\\wedge q$",
      "$p\\vee(q\\vee(-p))$",
      "$p\\wedge(q\\wedge(-p))$"
    ],
    "answer": "$p\\vee(q\\vee(-p))$"
  },
  {
    "section": "Mathematics",
    "content": "Mean and variance of 12 observations... If correct variance is m/n, then m+n is equal to",
    "options": [
      "315",
      "316",
      "314",
      "317"
    ],
    "answer": "315"
  },
  {
    "section": "Mathematics",
    "content": "Let A={1..7}. Relation R... x+y=7 is",
    "options": [
      "an equivalence relation",
      "symmetric but neither reflexive nor transitive",
      "transitive but neither symmetric nor reflexive",
      "reflexive but neither symmetric nor transitive"
    ],
    "answer": "an equivalence relation"
  },
  {
    "section": "Mathematics",
    "content": "If A = Matrix... and $A^{-1}=\\alpha A+\\beta I$ ... then $4\\alpha^{2}+\\beta^{2}+\\lambda^{2}$ is equal to",
    "options": [
      "12",
      "19",
      "14",
      "10"
    ],
    "answer": "14"
  },
  {
    "section": "Mathematics",
    "content": "Let S be the set of all values of $\\theta$... system of linear equations... Then sum is equal to",
    "options": [
      "20",
      "40",
      "30",
      "10"
    ],
    "answer": "40"
  },
  {
    "section": "Mathematics",
    "content": "If domain of the function... is... then $18(\\alpha^{2}+\\beta^{2}+\\gamma^{2}+\\delta^{2})$ is equal to",
    "options": [
      "20",
      "18",
      "24",
      "12"
    ],
    "answer": "20"
  },
  {
    "section": "Mathematics",
    "content": "Let R={a,b,c,d,e} and S={1,2,3,4}. Total number of onto functions f:R->S such that f(a)!=1 is equal to",
    "options": [],
    "answer": "180"
  },
  {
    "section": "Mathematics",
    "content": "Let k and m be positive real numbers... function f(x) is differentiable... Value is equal to",
    "options": [],
    "answer": "309"
  },
  {
    "section": "Mathematics",
    "content": "The integral... is equal to",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  },
  {
    "section": "Mathematics",
    "content": "Let [t] denote the greatest integer function. If integral... then sum is equal to",
    "options": [],
    "answer": "150"
  },
  {
    "section": "Mathematics",
    "content": "Let the area enclosed by the lines... be A. Then 12A is",
    "options": [],
    "answer": "16"
  },
  {
    "section": "Mathematics",
    "content": "Let the solution curve... satisfy... then mn is equal to",
    "options": [],
    "answer": "20"
  },
  {
    "section": "Mathematics",
    "content": "Let vectors... be coplanar... then 6(a+b+c) is equal to",
    "options": [],
    "answer": "180"
  },
  {
    "section": "Mathematics",
    "content": "The area of the quadrilateral ABCD... is equal to",
    "options": [
      "48",
      "$8\\sqrt{38}$",
      "54",
      "$9\\sqrt{38}$"
    ],
    "answer": "54"
  },
  {
    "section": "Mathematics",
    "content": "For a,b integers... angle between plane... then $a^{4}+b^{2}$ is equal to",
    "options": [
      "32",
      "85",
      "25",
      "48"
    ],
    "answer": "85"
  },
  {
    "section": "Mathematics",
    "content": "Let P be the plane... image of point... then sum is equal to",
    "options": [
      "10",
      "12",
      "17",
      "11"
    ],
    "answer": "17"
  },
  {
    "section": "Mathematics",
    "content": "Let P1 be plane... P2 be plane... foot of perpendicular... sum is equal to",
    "options": [],
    "answer": "12"
  },
  {
    "section": "Mathematics",
    "content": "If probability... P(X>=2) is equal to",
    "options": [
      "7/9",
      "5/9",
      "2/9",
      "1/9"
    ],
    "answer": "11"
  }
  ],
  7:[
{
    "section": "Physics",
    "content": "A physical quantity 𝑃 is given as 𝑃=𝑎2𝑏3 𝑐√𝑑. The percentage error in the measurement of 𝑎, 𝑏, 𝑐 and 𝑑 are 1%, 2%, 3% and 4% respectively. The percentage error in the measurement of quantity 𝑃 will be",
    "options": [
      "13%",
      "16%",
      "12%",
      "14%"
    ],
    "answer": "13%"
  },
  {
    "section": "Physics",
    "content": "The position-time graphs for two students 𝐴 and 𝐵 returning from the school to their homes are shown in figure. (A) 𝐴 lives closer to the school (B) 𝐵 lives closer to the school (C) 𝐴 takes lesser time to reach home (D) 𝐴 travels faster than 𝐵 (E) 𝐵 travels faster than 𝐴 Choose the correct answer from the options given below<br><div class='flex justify-center my-4'><img src='images/7/q2.png' alt='Question 2'></div>",
    "options": [
      "A, C and D only",
      "A, C and E only",
      "B and E only",
      "A and E only"
    ],
    "answer": "A and E only"
  },
  {
    "section": "Physics",
    "content": "The range of the projectile projected at an angle of 15∘ with horizontal is 50 m. If the projectile is projected with same velocity at an angle of 45∘ with horizontal, then its range will be",
    "options": [
      "100 m",
      "100 √2 m",
      "50√2 m",
      "50 m"
    ],
    "answer": "100 m"
  },
  {
    "section": "Physics",
    "content": "A particle of mass 𝑚 moving with velocity 𝑣 collides with a stationary particle of mass 2𝑚. After collision, they stick together and continue to move together with velocity",
    "options": [
      "𝑣 3",
      "𝑣 4",
      "𝑣",
      "𝑣 2"
    ],
    "answer": "𝑣 3"
  },
  {
    "section": "Physics",
    "content": "Two satellites of masses m and 3 m revolve around the earth in circular orbits of radii r & 3r respectively. The ratio of orbital speeds of the satellites respectively is",
    "options": [
      "√3:1",
      "3:1",
      "9:1",
      "1:1"
    ],
    "answer": "√3:1"
  },
  {
    "section": "Physics",
    "content": "Assuming the earth to be a sphere of uniform mass density, the weight of a body at a depth 𝑑=𝑅 2 from the surface of earth, if its weight on the surface of earth is 200 N, will be : (Given 𝑅= radius of earth)",
    "options": [
      "300 N",
      "100 N",
      "400 N",
      "500 N"
    ],
    "answer": "100 N"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements:   Statement I: Pressure in a reservoir of water is same at all points at the same level of water. Statement II: The pressure applied to enclosed water is transmitted in all directions equally. In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "Both Statement I and Statement II are false",
      "Statement I is true but Statement II is false",
      "Statement I is false but Statement II is true",
      "Both Statement I and Statement II are true"
    ],
    "answer": "Both Statement I and Statement II are true"
  },
  {
    "section": "Physics",
    "content": "Consider two containers 𝐴 and 𝐵 containing monoatomic gases at the same Pressure 𝑃, Volume 𝑉 and Temperature 𝑇. The gas in 𝐴 is compressed isothermally to 1 8 of its original volume while the gas in 𝐵 is compressed adiabatically to 1 8 of its original volume. The ratio of final pressure of gas in 𝐵 to that of gas in 𝐴 is",
    "options": [
      "8",
      "4",
      "83 2",
      "1 8"
    ],
    "answer": "4"
  },
  {
    "section": "Physics",
    "content": "Match List I with List II: List I List II (A)3 Translational degrees of freedom (I) Monoatomic gases (B)3 Translational, 2 rotational degrees of freedoms (II) Polyatomic gases (C)3 Translational, 2 rotational and 1 vibrational degrees of freedom(III)Rigid diatomic gases (D)3 Translational, 3 rotational and more than one vibrational degrees of freedom(IV)Nonrigid diatomic gases Choose the correct answer from the options given below:",
    "options": [
      "A-I, B-III, C-IV, D-II",
      "A-IV, B-III, C-II, D-I",
      "A-IV, B-II, C-I, D-III",
      "A-I, B-IV, C-III, D-II"
    ],
    "answer": "A-I, B-III, C-IV, D-II"
  },
  {
    "section": "Physics",
    "content": "A particle executes S.H.M. of amplitude 𝐴 along 𝑥-axis. At 𝑡=0, the position of the particle is 𝑥=𝐴 2 and it moves along positive 𝑥-axis. The displacement of particle in time 𝑡 is 𝑥=𝐴 sin𝜔𝑡 + 𝛿, then the value 𝛿 will be",
    "options": [
      "𝜋 2",
      "𝜋 6",
      "𝜋 3",
      "𝜋 4"
    ],
    "answer": "𝜋 6"
  },
  {
    "section": "Physics",
    "content": "The equivalent capacitance of the combination shown is<br><div class='flex justify-center my-4'><img src='images/7/q11.png' alt='Question 11'></div>",
    "options": [
      "2 C",
      "5 3 C",
      "C 2",
      "4 C"
    ],
    "answer": "2 C"
  },
  {
    "section": "Physics",
    "content": "The equivalent resistance of the circuit shown below between points 𝑎 and 𝑏 is :<br><div class='flex justify-center my-4'><img src='images/7/q12.png' alt='Question 12'></div>",
    "options": [
      "16 Ω",
      "3.2 Ω",
      "24 Ω",
      "20 Ω"
    ],
    "answer": "3.2 Ω"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: Statement I: If the number of turns in the coil of a moving coil galvanometer is doubled then the current sensitivity becomes double. Statement II: Increasing current sensitivity of a moving coil galvanometer by only increasing the number of turns in the coil will also increase its voltage sensitivity in the same ratio In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "Statement I is true but Statement II is false",
      "Statement I is false but Statement II is true",
      "Both Statement I and Statement II are false",
      "Both Statement I and Statement II are true"
    ],
    "answer": "Statement I is true but Statement II is false"
  },
  {
    "section": "Physics",
    "content": "The energy of an electromagnetic wave contained in a small volume oscillates with",
    "options": [
      "Double the frequency of the wave",
      "The frequency of the wave",
      "Half the frequency of the wave",
      "Zero frequency"
    ],
    "answer": "Double the frequency of the wave"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: Statement I: Maximum power is dissipated in a circuit containing an inductor, a capacitor and a resistor connected in series with an 𝐴𝐶 source, when resonance occurs. Statement II: Maximum power is dissipated in a circuit containing pure resistor due to zero phase difference between current and voltage. In the light of the above statements, choose the correct answer from the options given below:<br><div class='flex justify-center my-4'><img src='images/7/q15.png' alt='Question 15'></div>",
    "options": [
      "Statement I is false but Statement II is true",
      "Both Statement I and Statement II are true",
      "Statement I is true but Statement II is false",
      "Both Statement I and Statement II are false"
    ],
    "answer": "Both Statement I and Statement II are true"
  },
  {
    "section": "Physics",
    "content": "An object is placed at a distance of 12 cm in front of a plane mirror. The virtual and erect image is formed by the mirror. Now the mirror is moved by 4 cm towards the stationary object. The distance by which the position of image would be shifted, will be",
    "options": [
      "4 cm towards mirror",
      "8 cm towards mirror",
      "8 cm away from mirror",
      "2 cm towards mirror"
    ],
    "answer": "8 cm towards mirror"
  },
  {
    "section": "Physics",
    "content": "The de Broglie wavelength of a molecule in a gas at room temperature 300 K is 𝜆1. If the temperature of the gas is increased to 600 K, then the de Broglie wavelength of the same gas molecule becomes",
    "options": [
      "1 2𝜆1",
      "√2𝜆1",
      "1 √2𝜆1",
      "2𝜆1"
    ],
    "answer": "1 √2𝜆1"
  },
  {
    "section": "Physics",
    "content": "The angular momentum for the electron in Bohr’s orbit is 𝐿. If the electron is assumed to revolve in second orbit of hydrogen atom, then the change in angular momentum will be",
    "options": [
      "Zero",
      "2𝐿",
      "𝐿",
      "𝐿 2"
    ],
    "answer": "𝐿"
  },
  {
    "section": "Physics",
    "content": "A zener diode of power rating 1.6 W is to be used as voltage regulator. If the zener diode has a breakdown of 8 V and it has to regulate voltage fluctuating between 3 V and 10 V The value of resistance 𝑅𝑠 for safe operation of diode will be",
    "options": [
      "10 Ω",
      "12 Ω",
      "13.3 Ω",
      "13 Ω"
    ],
    "answer": "10 Ω"
  },
  {
    "section": "Physics",
    "content": "A carrier wave of amplitude 15 V is modulated by a sinusoidal base band signal of amplitude 3 V. The ratio of maximum amplitude to minimum amplitude in an amplitude modulated wave is",
    "options": [
      "2",
      "3 2",
      "1",
      "5"
    ],
    "answer": "3 2"
  },
  {
    "section": "Physics",
    "content": "A closed circular tube of average radius 15 cm, whose inner walls are rough, is kept in vertical plane. A block of mass 1 kg just fit inside the tube. The speed of block is 22 m s-1, when it is introduced at the top of tube. After completing five oscillations, the block stops at the bottom region of tube. The work done by the tube on the block is ________ J. (Given 𝑔=10 m s-2).",
    "options": [],
    "answer": "245"
  },
  {
    "section": "Physics",
    "content": "If the earth suddenly shrinks to 1 64th of its original volume with its mass remaining the same, the period of rotation of earth becomes 24 𝑥ℎ. The value of 𝑥 is ________",
    "options": [],
    "answer": "16"
  },
  {
    "section": "Physics",
    "content": "Two wires each of radius 0.2 cm and negligible mass, one made of steel and the other made of brass are loaded as shown in the figure. The elongation of the steel wire is ______ 10–6 m. [Young's modulus for steel =2×1011 N m–2 and 𝑔=10 m s–2]<br><div class='flex justify-center my-4'><img src='images/7/q23.png' alt='Question 23'></div>",
    "options": [],
    "answer": "20"
  },
  {
    "section": "Physics",
    "content": "A transverse harmonic wave on a string is given by 𝑦𝑥, 𝑡=5 sin6𝑡+0.003𝑥 where 𝑥 and 𝑦 are in cm and 𝑡 in sec. The wave velocity is _________ m s-1.",
    "options": [],
    "answer": "20"
  },
  {
    "section": "Physics",
    "content": "Three concentric spherical metallic shells 𝑋, 𝑌 and 𝑍 of radius 𝑎, 𝑏 and 𝑐 respectively 𝑎<𝑏<𝑐 have surface charge densities 𝜎, – 𝜎 and 𝜎, respectively. The shells 𝑋 and 𝑍 are at same potential. If the radii of 𝑋 & 𝑌 are 2 cm and 3 cm, respectively. The radius of shell 𝑍 is _____ cm.",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Physics",
    "content": "10 resistors each of resistance 10 Ω can be connected in such as to get maximum and minimum equivalent resistance. The ratio of maximum and minimum equivalent resistance will be________.",
    "options": [],
    "answer": "100"
  },
  {
    "section": "Physics",
    "content": "The current required to be passed through a solenoid of 15 cm length and 60 turns in order to demagnetise a bar magnet of magnetic intensity 2.4×103 A m–1 is ________ A.",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Physics",
    "content": "A 1 m long metal rod 𝑋𝑌 completes the circuit as shown in figure. The plane of the circuit is perpendicular to the magnetic field of flux density 0.15 T. If the resistance of the circuit is 5 Ω, the force needed to move the rod in direction, as indicated, with a constant speed of 4 m s-1 will be _______ 10–3 N.<br><div class='flex justify-center my-4'><img src='images/7/q28.png' alt='Question 28'></div>",
    "options": [],
    "answer": "18"
  },
  {
    "section": "Physics",
    "content": "Unpolarised light of intensity 32 W m−2 passes through the combination of three polaroids such that the pass axis of the last polaroids is perpendicular to that of the pass axis of first polaroids. If intensity of emerging light is 3 W m−2, then the angle between pass axis of first two polaroids is _________ °.",
    "options": [],
    "answer": "30"
  },
  {
    "section": "Physics",
    "content": "The decay constant for a radioactive nuclide is 1.5×10-5 s-1. Atomic weight of the substance is 60 g mole-1, 𝑁𝐴=6×1023. The activity of 1.0 µg of the substance is ________ ×1010 Bq.",
    "options": [],
    "answer": "15"
  },
  {
    "section": "Chemistry",
    "content": "The number of molecules and moles in 2.8375 litres of O2 at STP are respectively",
    "options": [
      "7.527 ×1023 and 0.125 mol",
      "7.527 ×1022 and 0.250 mol",
      "1.505 ×1023 and 0.250 mol",
      "7.527 ×1022 and 0.125 mol"
    ],
    "answer": "7.527 ×1022 and 0.125 mol"
  },
  {
    "section": "Chemistry",
    "content": "The pair from the following pairs having both compounds with net non-zero dipole moment is",
    "options": [
      "1, 4-Dichlorobenzene, 1, 3-Dichlorobenzene",
      "cis-butene, trans-butene",
      "CH 2Cl2, CHCl 3",
      "Benzene, anisidine"
    ],
    "answer": "CH 2Cl2, CHCl 3"
  },
  {
    "section": "Chemistry",
    "content": "The compound which does not exist is",
    "options": [
      "NaO 2",
      "BeH 2",
      "PbEt 4",
      "NH 42BeF 4"
    ],
    "answer": "NaO 2"
  },
  {
    "section": "Chemistry",
    "content": "The enthalpy change for the adsorption process and micelle formation respectively are",
    "options": [
      "ΔH ads>0 and ΔH mic<0",
      "ΔH ads>0 and ΔH mic>0",
      "ΔH ads<0 and ΔH mic>0",
      "ΔH ads<0 and ΔH mic<0"
    ],
    "answer": "ΔH ads<0 and ΔH mic>0"
  },
  {
    "section": "Chemistry",
    "content": "Given (A) 2CO g+O2g→2CO 2g ΔH 1o=-x kJ mol-1 (B) Cgraphite +O2g→CO 2g ΔH 2o=-y kJ mol-1 The ∆Ho for the reaction Cgraphite +1 2O2g→COg is<br><div class='flex justify-center my-4'><img src='images/7/q35.png' alt='Question 35'></div>",
    "options": [
      "2x-y 2",
      "x+2y 2",
      "x-2y 2",
      "2y-x"
    ],
    "answer": "x-2y 2"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two reactions, involved in the commercial production of dihydrogen H2. The two reactions are carried out at temperature “ T1” and “ T2”, respectively Cs+H2OgT1 ⟶COg+H2g COg+H2OgT2 CatalystCO 2g+H2g The temperatures T1 and T2 are correctly related as",
    "options": [
      "T1=T2",
      "T1<T2",
      "T1=100 K, T2=1270 K",
      "T1>T2"
    ],
    "answer": "T1>T2"
  },
  {
    "section": "Chemistry",
    "content": "Lime reacts exothermally with water to give ‘ A’ which has low solubility in water. Aqueous solution of ‘ A’ is often used for the test of CO 2, a test in which insoluble B is formed. If B is further reacted with CO 2 then soluble compound is formed. ‘ A' is",
    "options": [
      "Quick lime",
      "Slaked lime",
      "White lime",
      "Lime water"
    ],
    "answer": "Slaked lime"
  },
  {
    "section": "Chemistry",
    "content": "Using column chromatography, mixture of two compounds ‘ A’ and ‘ B’ was separated. ‘ A’ eluted first, this indicates ‘ B’ has<br><div class='flex justify-center my-4'><img src='images/7/q38.png' alt='Question 38'></div>",
    "options": [
      "low Rf, stronger adsorption",
      "high Rf, weaker adsorption",
      "high Rf, stronger adsorption",
      "low Rf, weaker adsorption"
    ],
    "answer": "low Rf, stronger adsorption"
  },
  {
    "section": "Chemistry",
    "content": "The major product ' P' formed in the given reaction is<br><div class='flex justify-center my-4'><img src='images/7/q39.png' alt='Question 39'></div>",
    "options": [
      "CH2COOH Structure",
      "COOH-COOH Structure",
      "CH2COOH with OH",
      "COOH Structure with HO"
    ],
    "answer": "COOH-COOH Structure"
  },
  {
    "section": "Chemistry",
    "content": "Match List I with List II List I Industry List II Waste Generated (A) Steel plants (I) Gypsum (B) Thermal power plants (II) Fly ash (C) Fertilizer Industries (III) Slag (D) Paper mills (IV) Bio-degradable wastes Choose the correct answer from the options given below :",
    "options": [
      "A-III, B-II, C-I, D-IV",
      "A-III, B-IV, C-I, D-II",
      "A-II, B-III, C-IV, D-I",
      "A-IV, B-I, C-II, D-III"
    ],
    "answer": "A-III, B-II, C-I, D-IV"
  },
  {
    "section": "Chemistry",
    "content": "Which of the following is used as a stabilizer during the concentration of sulphide ores?",
    "options": [
      "Pine oils",
      "Fatty acids",
      "Xanthates",
      "Cresols"
    ],
    "answer": "Cresols"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: Statement I : Aqueous solution of K2Cr2O7 is preferred as a primary standard in volumetric analysis over Na2Cr2O7 aqueous solution. Statement II : K2Cr2O7 has a higher solubility in water than Na2Cr2O7. In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "Statement I is false but Statement II is true",
      "Both Statement I and Statement II are true",
      "Statement I is true but Statement II is false",
      "Both Statement I and Statement II are false"
    ],
    "answer": "Statement I is true but Statement II is false"
  },
  {
    "section": "Chemistry",
    "content": "Prolonged heating is avoided during the preparation of ferrous ammonium sulphate to",
    "options": [
      "Prevent hydrolysis",
      "Prevent reduction",
      "Prevent breaking",
      "Prevent oxidation"
    ],
    "answer": "Prevent oxidation"
  },
  {
    "section": "Chemistry",
    "content": "Which of the following statements are correct? (A) The M3+/M2+ reduction potential for iron is greater than manganese. (B) The higher oxidation states of first row d-block elements get stabilized by oxide ion (C) Aqueous solution of Cr2+ can liberate hydrogen from dilute acid (D) Magnetic moment of V2+ is observed between 4.4-5.2 BM   Choose the correct answer from the options given below:",
    "options": [
      "B, C only",
      "A, B, D only",
      "C, D only",
      "A, B only"
    ],
    "answer": "B, C only"
  },
  {
    "section": "Chemistry",
    "content": "The octahedral diamagnetic low spin complex among the following is",
    "options": [
      "CoNH 363+",
      "CoF 63-",
      "CoCl 63-",
      "NiCl 42"
    ],
    "answer": "CoNH 363+"
  },
  {
    "section": "Chemistry",
    "content": "Identify the correct order of reactivity for the following pairs towards the respective mechanism (A) (B) (C) Electrophilic substitution (D) Nucleophilic substitution Choose the correction answer from the options given below:<br><div class='flex justify-center my-4'><img src='images/7/q46.png' alt='Question 46'></div>",
    "options": [
      "B, C and D only",
      "A, B, C and D",
      "A, B and D only",
      "A, C and Donly"
    ],
    "answer": "A, B, C and D"
  },
  {
    "section": "Chemistry",
    "content": "Suitable reaction condition for preparation of Methyl phenyl ether is",
    "options": [
      "PhO⊝Na⊕, MeOH",
      "Benzene, MeBr",
      "Ph-Br, MeO⊖Na⊕",
      "PhO⊝Na⊕, MeBr"
    ],
    "answer": "PhO⊝Na⊕, MeBr"
  },
  {
    "section": "Chemistry",
    "content": "Isomeric amines with molecular formula C8H11N give the following tests Isomer P⇒ Can be prepared by Gabriel phthalimide synthesis Isomer Q⇒ Reacts with Hinsberg’s reagent to give solid insoluble in NaOH Isomer R⇒ Reacts with HONO followed by β-naphthol in NaOH to give red dye. Isomers P, Q and R respectively are",
    "options": [
      "Structure 1",
      "Structure 2",
      "Structure 3",
      "Structure 4"
    ],
    "answer": "Structure 4"
  },
  {
    "section": "Chemistry",
    "content": "Match List-I with List-II. List-I Polymer List-II Type/Class A.Nylon- 2-Nylon- 6 I. Thermosetting polymer B.Buna- N II. Biodegradable polymer C.Ureaformaldehyde resin III. Synthetic rubber D.Dacron IV. Polyester Choose the correct answer from the options given below:",
    "options": [
      "A→IV; B→I; C→II; D→II",
      "A→II; B→III; C→I; D→IV",
      "A→IV; B→III; C→I; D→II",
      "A→II; B→I; C→IV; D→III"
    ],
    "answer": "A→II; B→III; C→I; D→IV"
  },
  {
    "section": "Chemistry",
    "content": "The one that does not stabilize 2∘ and 3∘ structures of proteins is",
    "options": [
      "–S–S–linkage",
      "H-bonding",
      "–O–O–linkage",
      "van der Waals forces"
    ],
    "answer": "–O–O–linkage"
  },
  {
    "section": "Chemistry",
    "content": "The number of bent-shaped molecule/s from the following is ______ N3-, NO 2-, I3-, O3, SO2",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "content": "The sum of lone pairs present on the central atom of the interhalogen IF5 and IF7 is ______",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "content": "At constant temperature, a gas is at a pressure of 940 .3 mm Hg. The pressure at which its volume decreases by 40% is ______ mm Hg. (Nearest integer)",
    "options": [],
    "answer": "1567"
  },
  {
    "section": "Chemistry",
    "content": "FeO 42-+2.2 V ⟶ Fe3++0.70 V ⟶ Fe2+-0.45 V ⟶ Fe0 EFeO42-/Fe2+θ is x×10-3 V. The value of x is _______",
    "options": [],
    "answer": "1825"
  },
  {
    "section": "Chemistry",
    "content": "The number of incorrect statement/s about the black body from the following is______ (A) Emit or absorb energy in the form of electromagnetic radiation. (B) Frequency distribution of the emitted radiation depends on temperature. (C) At a given temperature, intensity vs frequency curve passes through a maximum value.   (D) The maximum of the intensity vs frequency curve is at a higher frequency at higher temperature compared to that at lower temperature.",
    "options": [],
    "answer": "0"
  },
  {
    "section": "Chemistry",
    "content": "The number of correct statement/s involving equilibria in physical processes from the following is ________ (A) Equilibrium is possible only in a closed system at a given temperature. (B) Both the opposing processes occur at the same rate. (C) When equilibrium is attained at a given temperature, the value of all its parameters became equal (D) For dissolution of solids in liquids, the solubility is constant at a given temperature.",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "content": "In the following reaction, the total number of oxygen atoms in 𝑋 and 𝑌 is______  Na2O+H2O→2X Cl2O7+H2O→2Y",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Chemistry",
    "content": "If the degree of dissociation of aqueous solution of weak monobasic acid is determined to be 0.3, then the observed freezing point will be _____ % higher than the expected/theoretical freezing point. (Nearest integer).",
    "options": [],
    "answer": "30"
  },
  {
    "section": "Chemistry",
    "content": "A molecule undergoes two independent first order reactions whose respective half lives are 12 min and 3 min. If both the reactions are occurring then the time taken for the 50% consumption of the reactant is ______ min. (Nearest integer)",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "content": "In potassium ferrocyanide, there are ______ pairs of electrons in the t2g set of orbitals.",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Mathematics",
    "content": "Let the complex number 𝑧=𝑥+𝑖𝑦 be such that 2𝑧-3𝑖 2𝑧+𝑖 is purely imaginary. If 𝑥+𝑦2=0, then 𝑦4+𝑦2-𝑦 is equal to",
    "options": [
      "2 3",
      "3 2",
      "3 4",
      "4 3"
    ],
    "answer": "3 4"
  },
  {
    "section": "Mathematics",
    "content": "Let the first term a and the common ratio 𝑟 of a geometric progression be positive integers. If the sum of squares of its first three terms is 33033, then the sum of these three terms is equal to",
    "options": [
      "241",
      "231",
      "210",
      "220"
    ],
    "answer": "231"
  },
  {
    "section": "Mathematics",
    "content": "If the coefficient of 𝑥7 in 𝑎𝑥-1 𝑏𝑥213 and the coefficient of 𝑥-5 in 𝑎𝑥+1 𝑏𝑥213 are equal, then 𝑎4𝑏4 is equal to:",
    "options": [
      "11",
      "44",
      "22",
      "33."
    ],
    "answer": "22"
  },
  {
    "section": "Mathematics",
    "content": "96 cos𝜋 33 cos2𝜋 33 cos4𝜋 33 cos8𝜋 33 cos16𝜋 33 is equal to",
    "options": [
      "3",
      "1",
      "4",
      "2"
    ],
    "answer": "3"
  },
  {
    "section": "Mathematics",
    "content": "A line segment 𝐴𝐵 of length 𝜆 moves such that the points 𝐴 and 𝐵 remain on the periphery of a circle of radius 𝜆. Then the locus of the point, that divides the line segment 𝐴𝐵 in the ratio 2 : 3, is a circle of radius",
    "options": [
      "3 5𝜆",
      "2 3𝜆",
      "√19 5𝜆",
      "√19 7𝜆"
    ],
    "answer": "√19 5𝜆"
  },
  {
    "section": "Mathematics",
    "content": "Let the ellipse 𝐸:𝑥2+9𝑦2=9 intersect the positive 𝑥- and 𝑦-axes at the points 𝐴 and 𝐵 respectively. Let the major axis of 𝐸 be a diameter of the circle 𝐶. Let the line passing through 𝐴 and 𝐵 meet the circle 𝐶 at the point 𝑃. If the area of the triangle with vertices 𝐴, 𝑃 and the origin 𝑂 is 𝑚 𝑛 where 𝑚 and 𝑛 are coprime, then 𝑚-𝑛 is equal to",
    "options": [
      "16",
      "15",
      "17",
      "18"
    ],
    "answer": "17"
  },
  {
    "section": "Mathematics",
    "content": "The negation of the statement 𝑝∨𝑞∧𝑞∨~𝑟 is",
    "options": [
      "𝑝∨𝑟∧~𝑞",
      "~𝑝∨𝑟∧~𝑞",
      "~𝑝∨~𝑞∨~𝑟",
      "~𝑝∨~𝑞∧~𝑟"
    ],
    "answer": "~𝑝∨𝑟∧~𝑞"
  },
  {
    "section": "Mathematics",
    "content": "If 𝐴 is a 3×3 matrix and 𝐴=2 then 3 adj 3𝐴𝐴2 is equal to",
    "options": [
      "312⋅611",
      "312⋅610",
      "310⋅611",
      "311⋅610"
    ],
    "answer": "311⋅610"
  },
  {
    "section": "Mathematics",
    "content": "For the system of linear equations 2𝑥-𝑦+3𝑧=5 3𝑥+2𝑦-𝑧=7 4𝑥+5𝑦+𝛼𝑧=𝛽, which of the following is NOT correct?",
    "options": [
      "The system has infinitely many solutions for 𝛼=-5 and 𝛽=9",
      "The system has infinitely many solutions for 𝛼=-6 and 𝛽=9",
      "The system in inconsistent for 𝛼=-5 and 𝛽=8",
      "The system has a unique solution for 𝛼≠-5 and 𝛽=8"
    ],
    "answer": "The system has infinitely many solutions for 𝛼=-6 and 𝛽=9"
  },
  {
    "section": "Mathematics",
    "content": "If 𝑓𝑥=tan1∘𝑥+loge123 𝑥loge1234-tan1∘, 𝑥>0 then the least value of 𝑓𝑓𝑥+𝑓𝑓4 𝑥 is",
    "options": [
      "0",
      "8",
      "2",
      "4"
    ],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "content": "A square piece of tin of side 30 cm is to be made into a box without top by cutting a square from each corner and folding up the flaps to form a box. If the volume of the box is maximum, then its surface area (in cm2) is equal to",
    "options": [
      "800",
      "675",
      "1025",
      "900"
    ],
    "answer": "800"
  },
  {
    "section": "Mathematics",
    "content": "If 𝐼𝑥=∫esin2𝑥cos𝑥 sin2𝑥-sin𝑥𝑑𝑥 and 𝐼0=1, then 𝐼𝜋 3 is equal to",
    "options": [
      "-1 2e3 4",
      "1 2e3 4",
      "-e3 4",
      "e3 4"
    ],
    "answer": "1 2e3 4"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝑓 be a differentiable function such that 𝑥2𝑓𝑥-𝑥=4∫0𝑥𝑡 𝑓𝑡 𝑑𝑡, 𝑓1=2 3 Then 18 𝑓3 is equal to",
    "options": [
      "210",
      "160",
      "150",
      "180"
    ],
    "answer": "160"
  },
  {
    "section": "Mathematics",
    "content": "The slope of tangent at any point 𝑥, 𝑦 on a curve 𝑦=𝑦𝑥 is 𝑥2+𝑦2 2𝑥𝑦. 𝑥>0. If 𝑦2=0, then a value of 𝑦8 is",
    "options": [
      "-4√2",
      "2√3",
      "-2√3",
      "4√3"
    ],
    "answer": "4√3"
  },
  {
    "section": "Mathematics",
    "content": "An arc 𝑃𝑄 of a circle subtends a right angle at its centre 𝑂. The mid point of the arc 𝑃𝑄 is 𝑅. If 𝑂𝑃⃗=𝑢→, 𝑂𝑅⃗=𝑣→ and 𝑂𝑄⃗=𝛼𝑢→+𝛽𝑣→ then 𝛼, 𝛽2, are the roots of the equation",
    "options": [
      "𝑥2+𝑥-2=0",
      "𝑥2-𝑥-2=0",
      "3𝑥2-2𝑥-1=0",
      "3𝑥2+2𝑥-1=0"
    ],
    "answer": "𝑥2-𝑥-2=0"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝑂 be the origin and the position vector of the point 𝑃 be -𝑖-2𝑗+3𝑘 If the position vectors of the points 𝐴, 𝐵 and 𝐶 are -2𝑖+𝑗-3𝑘, 2𝑖+4𝑗-2𝑘 and -4𝑖∧+2𝑗-𝑘 respectively, then the projection of the vector 𝑂𝑃⃗ on a vector perpendicular to the vectors 𝐴𝐵⃗ and 𝐴𝐶⃗ is",
    "options": [
      "3",
      "8 10",
      "7 3",
      "1"
    ],
    "answer": "3"
  },
  {
    "section": "Mathematics",
    "content": "Let two vertices of a triangle 𝐴𝐵𝐶 be 2, 4, 6 and 0, -2, -5, and its centroid be 2, 1, 1. If the image of the third vertex in the plane 𝑥+2𝑦+4𝑧=11 is 𝛼, 𝛽, 𝛾 then 𝛼𝛽+𝛽𝛾+𝛾𝛼 is equal to",
    "options": [
      "70",
      "76",
      "74",
      "72"
    ],
    "answer": "74"
  },
  {
    "section": "Mathematics",
    "content": "The shortest distance between the lines 𝑥+2 1=𝑦 -2=𝑧-5 2 and 𝑥-4 1=𝑦-1 2=𝑧+3 0 is",
    "options": [
      "8",
      "6",
      "7",
      "9"
    ],
    "answer": "9"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝑃 be the point of intersection of the line 𝑥+3 3=𝑦+2 1=1-𝑧 2 and the plane 𝑥+𝑦+𝑧=2 If the distance of the point 𝑃 from the plane 3𝑥-4𝑦+12𝑧=32 is 𝑞, then 𝑞 and 2𝑞 are the roots of the equation",
    "options": [
      "𝑥2-18𝑥-72=0",
      "𝑥2-18𝑥+72=0",
      "𝑥2+18𝑥+72=0",
      "𝑥2+18𝑥-72=0"
    ],
    "answer": "𝑥2-18𝑥+72=0"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝑁 denote the sum of the numbers obtained when two dice are rolled. If the probability that 2𝑁<𝑁! is 𝑚 𝑛 where 𝑚 and 𝑛 are coprime, then 4𝑚-3𝑛 is equal to",
    "options": [
      "6",
      "12",
      "10",
      "8"
    ],
    "answer": "8"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝑎, 𝑏, 𝑐 be the three distinct positive real numbers such that 2𝑎log𝑒𝑎=𝑏𝑐log𝑒𝑏 and 𝑏log𝑒2=𝑎log𝑒𝑐 Then 6𝑎+5𝑏𝑐 is equal to ______.",
    "options": [],
    "answer": "8"
  },
  {
    "section": "Mathematics",
    "content": "The number of permutations, of the digits 1, 2, 3, …, 7 without repetition, which neither contain the string 153 nor the string 2467 , is _______ .",
    "options": [],
    "answer": "4898"
  },
  {
    "section": "Mathematics",
    "content": "Some couples participated in a mixed doubles badminton tournament. If the number of matches played, so that no couple played in a match, is 840, then the total numbers of persons, who participated in the tournament, is ________.",
    "options": [],
    "answer": "16"
  },
  {
    "section": "Mathematics",
    "content": "The sum of all those terms, of the arithmetic progression 3, 8, 13, ..., 373, which are not divisible by 3, is equal to ________.",
    "options": [],
    "answer": "9525"
  },
  {
    "section": "Mathematics",
    "content": "The coefficient of 𝑥7 in 1-𝑥+2𝑥310 is __________ .",
    "options": [],
    "answer": "960"
  },
  {
    "section": "Mathematics",
    "content": "Let a common tangent to the curves 𝑦2=4𝑥 and 𝑥-42+𝑦2=16 touch the curves at the points 𝑃 and 𝑄. Then 𝑃𝑄2 is equal to ________.",
    "options": [],
    "answer": "32"
  },
  {
    "section": "Mathematics",
    "content": "If the mean of the frequency distribution Class : 0-10 10-20 20-30 30-40 40-50 Frequency : 2 3 𝑥 5 4 is 28, then its variance is ________ .<br><div class='flex justify-center my-4'><img src='images/7/q87.png' alt='Question 87'></div>",
    "options": [],
    "answer": "151"
  },
  {
    "section": "Mathematics",
    "content": "The number of elements in the set 𝑛∈ℤ:𝑛2-10𝑛+19<6 is _______ .",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝑓:-2, 2→ℝ be defined by 𝑓𝑥=𝑥𝑥 ,-2<𝑥<0 𝑥-1𝑥 ,0≤𝑥<2 where 𝑥 denotes the greatest integer function. If 𝑚 and 𝑛 respectively are the number of points in –2, 2 at which 𝑦=𝑓𝑥 is not continuous and not differentiable, then 𝑚+𝑛 is equal to ________.",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝑦=𝑝𝑥 be the parabola passing through the points –1, 0, 0, 1 and 1, 0. If the area of the region 𝑥, 𝑦:𝑥+12+𝑦-12≤1, 𝑦≤𝑝𝑥 is 𝐴, then 12𝜋-4𝐴 is equal to ________ .",
    "options": [],
    "answer": "16"
  }

  ],

  8:[
  {
    "section": "Physics",
    "content": "A person travels 𝑥 distance with velocity 𝑣1 and then 𝑥 distance with velocity 𝑣2 in the same direction. The average velocity of the person is 𝑣, then the relation between 𝑣, 𝑣1 and 𝑣2 will be",
    "options": [
      "𝑣=𝑣1+𝑣2 2",
      "1 𝑣=1 𝑣1+1 𝑣2",
      "𝑣=𝑣1+𝑣2",
      "2 𝑣=1 𝑣1+1 𝑣2"
    ],
    "answer": "2 𝑣=1 𝑣1+1 𝑣2"
  },
  {
    "section": "Physics",
    "content": "Two projectiles are projected at 30° and 60°with the horizontal with the same speed. The ratio of the maximum height attained by the two projectiles respectively is:",
    "options": [
      "√3 : 1",
      "1 : √3",
      "2 : √3",
      "1 : 3"
    ],
    "answer": "1 : 3"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R Assertion A : An electric fan continues to rotate for some time after the current is switched off. Reason R : Fan continues to rotate due to inertia of motion. In the light of above statements, choose the most appropriate answer from the options given below.",
    "options": [
      "A is correct but R is not correct",
      "A is not correct but R is correct",
      "Both A and R are correct and R is the correct explanation of A",
      "Both A and R are correct but R is NOT the correct explanation of A"
    ],
    "answer": "Both A and R are correct and R is the correct explanation of A"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: Statement I : Rotation of the earth shows effect on the value of acceleration due to gravity 𝑔. Statement II : The effect of rotation of the earth on the value of 𝑔 at the equator is minimum and that at the pole is maximum. In the light of the above statements, choose the correct answer from the options given below",
    "options": [
      "Statement I is false but statement II is true",
      "Both Statement I and Statement II are true",
      "Both Statement I and Statement II are false",
      "Statement I is true but statement II is false"
    ],
    "answer": "Statement I is true but statement II is false"
  },
  {
    "section": "Physics",
    "content": "The time period of a satellite, revolving above earth's surface at a height equal to 𝑅 will be (Given 𝑔=𝜋2 m s-2, 𝑅= radius of earth)",
    "options": [
      "√2𝑅",
      "√8𝑅",
      "√32𝑅",
      "√4𝑅"
    ],
    "answer": "√32𝑅"
  },
  {
    "section": "Physics",
    "content": "Young’s moduli of the material of wires A and B are in the ratio of 1 : 4, while its area of cross sections are in the ratio of 1 : 3. If the same amount of load is applied to both the wires, the amount of elongation produced in the wires A and B will be in the ratio of [Assume length of wires A and B are same]",
    "options": [
      "12 : 1",
      "1 : 36",
      "36 : 1",
      "1 : 12"
    ],
    "answer": "12 : 1"
  },
  {
    "section": "Physics",
    "content": "A gas is compressed adiabatically, which one of the following statement is NOT true?",
    "options": [
      "There is no heat supplied to the system.",
      "There is no change in the internal energy",
      "The temperature of the gas increases",
      "The change in the internal energy is equal to the work done on the gas"
    ],
    "answer": "There is no change in the internal energy"
  },
  {
    "section": "Physics",
    "content": "A gas mixture consists of 2 moles of oxygen and 4 moles of neon at temperature T. Neglecting all vibrational modes, the total internal energy of the system will be:",
    "options": [
      "11 RT",
      "8 RT",
      "4 RT",
      "16 RT"
    ],
    "answer": "11 RT"
  },
  {
    "section": "Physics",
    "content": "For a periodic motion represented by the equation 𝑦 = sin 𝜔𝑡 + cos 𝜔𝑡, the amplitude of the motion is",
    "options": [
      "1",
      "0.5",
      "2",
      "√2"
    ],
    "answer": "√2"
  },
  {
    "section": "Physics",
    "content": "The distance between two plates of a capacitor is 𝑑 and its capacitance is 𝐶1, when air is the medium between the plates. If a metal sheet of thickness 2𝑑 3 and of the same area as plate is introduced between the plates, the capacitance of the capacitor becomes 𝐶2. The ratio 𝐶2 𝐶1 is",
    "options": [
      "3 : 1",
      "2 : 1",
      "4 : 1",
      "1 : 1"
    ],
    "answer": "3 : 1"
  },
  {
    "section": "Physics",
    "content": "In a metallic conductor, under the effect of applied electric field, the free electrons of the conductor",
    "options": [
      "Drift from higher potential to lower potential",
      "Move with the uniform velocity throughout from lower potential to higher potential",
      "Move in the straight line paths in the same direction",
      "Move in the curved paths from lower potential to higher potential"
    ],
    "answer": "Move in the curved paths from lower potential to higher potential"
  },
  {
    "section": "Physics",
    "content": "A bar magnet is released from rest along the axis of a very long vertical copper tube. After some time the magnet will",
    "options": [
      "Move down with an acceleration equal to 𝑔",
      "Oscillate inside the tube",
      "Move down with almost constant speed",
      "Move down with an acceleration greater than 𝑔"
    ],
    "answer": "Move down with almost constant speed"
  },
  {
    "section": "Physics",
    "content": "Given below are two statements: Statement I : For diamagnetic substance -1 ≤ 𝜒 < 0, where 𝜒 is the magnetic susceptibility. Statement II : Diamagnetic substance when placed in an external magnetic field, tend to move from stronger to weaker part of the field. In the light of the above statements, choose the correct answer from the options give below.",
    "options": [
      "Both Statement I and Statement II are False",
      "Statement I is correct but Statement II is false",
      "Statement I is incorrect but Statement II is true",
      "Both Statement I and Statement II are true"
    ],
    "answer": "Both Statement I and Statement II are true"
  },
  {
    "section": "Physics",
    "content": "The amplitude of magnetic field in an electromagnetic wave propagating along y-axis is 6.0 × 10–7 T. The maximum value of electric field in the electromagnetic wave is",
    "options": [
      "2 × 1015 V m-1",
      "180 V m-1",
      "6.0 × 10-7 V m-1",
      "5 × 1014 V m-1"
    ],
    "answer": "180 V m-1"
  },
  {
    "section": "Physics",
    "content": "The ratio of intensities at two points P and Q on the screen in a Young’s double slit experiment where phase difference between two waves of same amplitude are 𝜋 3 and 𝜋 2 respectively are",
    "options": [
      "2 : 3",
      "1 : 3",
      "3 : 1",
      "3 : 2"
    ],
    "answer": "3 : 2"
  },
  {
    "section": "Physics",
    "content": "The variation of stopping potential 𝑉0 as a function of the frequency (𝜈) of the incident light for a metal is shown in figure. The work function of the surface is<br><div class='flex justify-center my-4'><img src='images/8/q16.png' alt='Question 16'></div>",
    "options": [
      "2.98 eV",
      "2.07 eV",
      "1.36 eV",
      "18.6 eV"
    ],
    "answer": "2.07 eV"
  },
  {
    "section": "Physics",
    "content": "The half life of a radioactive substance is T. The time taken, for disintegrating 7 8 th part of its original mass will be:",
    "options": [
      "2T",
      "3T",
      "T",
      "8T"
    ],
    "answer": "3T"
  },
  {
    "section": "Physics",
    "content": "If each diode has a forward bias resistance of 25 Ω in the below circuit, Which of the following options is correct?<br><div class='flex justify-center my-4'><img src='images/8/q18.png' alt='Question 18'></div>",
    "options": [
      "𝐼1 𝐼2=1",
      "𝐼2 𝐼3=1",
      "𝐼1 𝐼2=2",
      "𝐼3 𝐼4=1"
    ],
    "answer": "𝐼1 𝐼2=2"
  },
  {
    "section": "Physics",
    "content": "A massage signal of frequency 3 kHz is used to modulate a carrier signal of frequency 1.5 MHz. The bandwidth of the amplitude modulated wave is",
    "options": [
      "6 MHz",
      "6 kHz",
      "3 MHz",
      "3 kHz"
    ],
    "answer": "6 kHz"
  },
  {
    "section": "Physics",
    "content": "In an experiment with vernier callipers of least count 0.1 mm, when two jaws are joined together the zero of vernier scale lies right to the zero of the main scale and 6th division of vernier scale coincides with the main scale division. While measuring the diameter of a spherical bob, the zero of vernier scale lies in between 3.2 cm and 3.3 cm marks and 4th division of vernier scale coincides with the main scale division. The diameter of bob is measured as",
    "options": [
      "3.22 cm",
      "3.18 cm",
      "3.26 cm",
      "3.25 cm"
    ],
    "answer": "3.18 cm"
  },
  {
    "section": "Physics",
    "content": "If the maximum load carried by an elevator is 1400 kg (600 kg - Passengers + 800 kg - elevator), which is moving up with a uniform speed of 3 m s-1 and the frictional force acting on it is 2000 N, then the maximum power used by the motor is __________ kW. (𝑔=10 m s-2)",
    "options": [],
    "answer": "48"
  },
  {
    "section": "Physics",
    "content": "A force of -𝑃𝑘 acts on the origin of the coordinate system. The torque about the point (2, -3) is 𝑃(𝑎𝑖 + 𝑏𝑗), The ratio 𝑎 𝑏 is 𝑥 2. The value of x is ______.",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Physics",
    "content": "Figure below shows a liquid being pushed out of the tube by a piston having area of cross section 2.0 cm2. The area of cross section at the outlet is 10 mm2. If the piston is pushed at a speed of 4 cm s-1, the speed of outgoing fluid is _________ cm s-1.",
    "options": [],
    "answer": "80"
  },
  {
    "section": "Physics",
    "content": "A rectangular block of mass 5 kg attached to a horizontal spiral spring executes simple harmonic motion of amplitude 1 m and time period 3.14 s. The maximum force exerted by spring on block is ________ N",
    "options": [],
    "answer": "20"
  },
  {
    "section": "Physics",
    "content": "An electron revolves around an infinite cylindrical wire having uniform linear charge density 2 × 10-8 C m-1 in circular path under the influence of attractive electrostatic field as shown in the figure. The velocity of electron with which it is revolving is _________ × 106 m s-1. Given mass of electron = 9 × 10-31 kg<br><div class='flex justify-center my-4'><img src='images/8/q25.png' alt='Question 25'></div>",
    "options": [],
    "answer": "8"
  },
  {
    "section": "Physics",
    "content": "A rectangular parallelopiped is measured as 1 cm × 1 cm × 100 cm. If its specific resistance is 3 × 10-7 Ω m, then the resistance between its two opposite rectangular faces will be _________ × 10-7 Ω.<br><div class='flex justify-center my-4'><img src='images/8/q26.png' alt='Question 26'></div>",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Physics",
    "content": "A straight wire carrying a current of 14 A is bent into a semicircular arc of radius 2.2 cm as shown in the figure. The magnetic field produced by the current at the centre O of the arc is ________ × 10-4 T<br><div class='flex justify-center my-4'><img src='images/8/q27.png' alt='Question 27'></div>",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Physics",
    "content": "A square loop of side 2.0 cm is placed inside a long solenoid that has 50 turns per centimetre and carries a sinusoidally varying current of amplitude 2.5 A and angular frequency 700 rad s-1. The central axes of the loop and solenoid coincide. The amplitude of the emf induced in the loop is 𝑥 × 10-4 V. The value of x is _______. ( Take, 𝜋 = 22 7)",
    "options": [],
    "answer": "44"
  },
  {
    "section": "Physics",
    "content": "A point object O is placed in front of two thin symmetrical coaxial convex lenses 𝐿1 and 𝐿2 with focal length 24 cm and 9 cm respectively. The distance between two lenses is 10 cm and the object is placed 6 cm away from lens 𝐿1 as shown in the figure. The distance between the object and the image formed by the system of two lenses is __________ cm<br><div class='flex justify-center my-4'><img src='images/8/q29.png' alt='Question 29'></div>",
    "options": [],
    "answer": "34"
  },
  {
    "section": "Physics",
    "content": "If 917 Å be the lowest wavelength of Lyman series then the lowest wavelength of Balmer series will be _______ Å.",
    "options": [],
    "answer": "3668"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R. Assertion A: 3.1500 g of hydrated oxalic acid dissolved in water to make 250.0 mL solution will result in 0.1 M oxalic acid solution. Reason R: Molar mass of hydrated oxalic acid is 126 g mol-1. In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "Both A and R are true but R is NOT the correct explanation of A",
      "A is true but R is false",
      "Both A and R are true and R is the correct explanation of A",
      "A is false but R is true"
    ],
    "answer": "Both A and R are true and R is the correct explanation of A"
  },
  {
    "section": "Chemistry",
    "content": "Match List-I with List-II List-I List-II A 16 g of CH4(g) I Weighs 28g B 1 g of H2(g) II 60.2 × 1023 electrons C 1 mole of N2(g) III Weighs 32g D 0.5 mol of SO2(g) IV Occupies 11.4 L volume at STP Choose the correct answer from the options given below:",
    "options": [
      "A-II, B-III, C-IV, D-I",
      "A-II, B-IV, C-I, D-III",
      "A-I, B-III, C-II, D-IV",
      "A-II, B-IV, C-III, D-I"
    ],
    "answer": "A-II, B-IV, C-I, D-III"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R Assertion A: The energy required to form Mg2+ from Mg is much higher than that required to produce Mg+ Reason R : Mg2+ is small ion and carry more charge than Mg+ In the light of the above statements, choose the correct answer from the options given below.",
    "options": [
      "Both A and R are true but R is NOT the correct explanation of A",
      "A is true but R is false",
      "A is false but R is true",
      "Both A and R are true and R is the correct explanation of A"
    ],
    "answer": "Both A and R are true and R is the correct explanation of A"
  },
  {
    "section": "Chemistry",
    "content": "The correct order of metallic character is",
    "options": [
      "K > Be > Ca",
      "Be > Ca > K",
      "Ca > K > Be",
      "K > Ca > Be"
    ],
    "answer": "K > Ca > Be"
  },
  {
    "section": "Chemistry",
    "content": "Gibbs energy vs T plot for the formation of oxides is given below. For the given diagram, the correct statement is-<br><div class='flex justify-center my-4'><img src='images/8/q35.png' alt='Question 35'></div>",
    "options": [
      "At 600°C CO cannot reduce FeO",
      "At 600°C CO can reduce ZnO",
      "At 600°C, C can reduce ZnO",
      "At 600°C C can reduce FeO"
    ],
    "answer": "At 600°C C can reduce FeO"
  },
  {
    "section": "Chemistry",
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R. Assertion A: Physical properties of isotopes of hydrogen are different. Reason R: Mass difference between isotopes of hydrogen is very large. In the light of the above statements, choose the correct answer from the options given below:",
    "options": [
      "Both A and R are true and R is the correct explanation of A",
      "A is false but R is true",
      "A is true but R is false",
      "Both A and R are true but R is NOT the correct explanation of A"
    ],
    "answer": "Both A and R are true and R is the correct explanation of A"
  },
  {
    "section": "Chemistry",
    "content": "Number of water molecules in washing soda and soda ash respectively are:",
    "options": [
      "1 and 10",
      "10 and 1",
      "10 and 0",
      "1 and 0"
    ],
    "answer": "10 and 0"
  },
  {
    "section": "Chemistry",
    "content": "The decreasing order of hydride affinity for following carbocations is: (A) (B) (C) (D) Choose the correct answer from the options given below:<br><div class='flex justify-center my-4'><img src='images/8/q38.png' alt='Question 38'></div>",
    "options": [
      "C, A, D, B",
      "C, A, B, D",
      "A, C, D, B",
      "A, C, B, D"
    ],
    "answer": "C, A, B, D"
  },
  {
    "section": "Chemistry",
    "content": "The correct order for acidity of the following hydroxyl compound is (A) CH3OH (B) (CH3)3COH (C) Phenol (D) p-Nitrophenol (E) m-Nitrophenol Choose the correct answer from the options given below:",
    "options": [
      "C > E > D > B > A",
      "E > D > C > B > A",
      "D > E > C > A > B",
      "E > C > D > A > B"
    ],
    "answer": "E > C > D > A > B"
  },
  {
    "section": "Chemistry",
    "content": "In Carius tube, an organic compound 'X' is treated with sodium peroxide to form a mineral acid 'Y'. The solution of BaCl2 is added to 'Y' to form a precipitate 'Z'. 'Z' is used for the quantitative estimation of an extra element. 'X' could be",
    "options": [
      "Cytosine",
      "A nucleotide",
      "Methionine",
      "Chloroxylenol"
    ],
    "answer": "Methionine"
  },
  {
    "section": "Chemistry",
    "content": "The delicate balance of CO2 and O2 is NOT disturbed by",
    "options": [
      "Respiration",
      "Burning of coal",
      "Deforestation",
      "Burning of petroleum"
    ],
    "answer": "Respiration"
  },
  {
    "section": "Chemistry",
    "content": "The correct relationships between unit cell edge length 'a' and radius of sphere 'r' for face-centred and body-centred cubic structures respectively are:",
    "options": [
      "2√2r = a and √3r = 4a",
      "r = 2√2a and 4r = √3a",
      "r = 2√2a and √3r = 4a",
      "2√2r = a and 4r = √3a"
    ],
    "answer": "2√2r = a and 4r = √3a"
  },
  {
    "section": "Chemistry",
    "content": "Ferric chloride is applied to stop bleeding because",
    "options": [
      "Blood absorbs FeCl3 and forms a complex.",
      "Cl- ions cause coagulation of blood.",
      "Fe3+ ions coagulate blood which is a negatively charged sol.",
      "FeCl3 reacts with the constituents of blood which is a positively charged sol."
    ],
    "answer": "Fe3+ ions coagulate blood which is a negatively charged sol."
  },
  {
    "section": "Chemistry",
    "content": "Match List-I with List-II. List-I Complex List-II Crystal Field splitting energy (Δ0) A. [Ti(H2O)6]2+ I. -1.2 B. [V(H2O)6]2+ II. -0.6 C. [Mn(H2O)6]3+ III. 0 D. [Fe(H2O)6]3+ IV. -0.8 Choose the correct answer from the options given below:",
    "options": [
      "A-II, B-IV, C-I, D-III",
      "A-IV, B-I, C-III, D-II",
      "A-IV, B-I, C-II, D-III",
      "A-II, B-IV, C-III, D-I"
    ],
    "answer": "A-IV, B-I, C-II, D-III"
  },
  {
    "section": "Chemistry",
    "content": "The correct order of the number of unpaired electrons in the given complexes is (A) [Fe(CN)6]3- (B) [FeF6]3- (C) [CoF6]3- (D) [Cr(oxalate)3]3- (E) [Ni(CO)4] Choose the correct answer from the options given below:",
    "options": [
      "E < A < D < C < B",
      "D < A < B < C",
      "A < E < C < B < D",
      "A < E < D < C < B"
    ],
    "answer": "E < A < D < C < B"
  },
  {
    "section": "Chemistry",
    "content": "The major product 'P' formed in the given reaction is<br><div class='flex justify-center my-4'><img src='images/8/q46.png' alt='Question 46'></div>",
    "options": [
      "Product 1",
      "Product 2",
      "Product 3",
      "Product 4"
    ],
    "answer": "Product 1"
  },
  {
    "section": "Chemistry",
    "content": "Incorrect method of preparation for alcohols from the following is:",
    "options": [
      "Reaction of Ketone with RMgBr followed by hydrolysis.",
      "Reaction of alkyl halide with aqueous NaOH.",
      "Hydroboration-oxidation of alkene.",
      "Ozonolysis of alkene"
    ],
    "answer": "Ozonolysis of alkene"
  },
  {
    "section": "Chemistry",
    "content": "In the reaction given below HNC (i) LiAlH4 -> 'X' (ii) H2O The product 'X' is<br><div class='flex justify-center my-4'><img src='images/8/q48.png' alt='Question 48'></div>",
    "options": [
      "Structure 1",
      "Structure 2",
      "Structure 3",
      "Structure 4"
    ],
    "answer": "Structure 3"
  },
  {
    "section": "Chemistry",
    "content": "Buna - S can be represented as:",
    "options": [
      "Structure 1",
      "Structure 2",
      "Structure 3",
      "Structure 4"
    ],
    "answer": "Structure 2"
  },
  {
    "section": "Chemistry",
    "content": "The reaction used for preparation of soap from fat is:",
    "options": [
      "An addition reaction",
      "Reduction reaction",
      "Alkaline hydrolysis reaction",
      "An oxidation reaction"
    ],
    "answer": "Alkaline hydrolysis reaction"
  },
  {
    "section": "Chemistry",
    "content": "The electron in the nth orbit of Li2+ is excited to (n + 1) orbit using the radiation of energy 1.47 × 10-17 J (as shown in the diagram). The value of n is ___________ Given: RH = 2.18 × 10-18 J",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "content": "For a metal ion, the calculated magnetic moment is 4.90 BM. This metal ion has ___________ number of unpaired electrons",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "content": "The number of molecules from the following which contain only two lone pair of electrons is ________ H2O, N2, CO, XeF4, NH3, NO, CO2, F2",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "content": "A(g) ⇌ 2B(g) + C(g) For the given reaction, if the initial pressure is 450 mmHg and the pressure at time t is 720 mmHg at a constant temperature T and constant volume V. The fraction of A(g) decomposed under these conditions is 𝑥 × 10-1. The value of x is _______ (nearest integer)",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "content": "The number of endothermic process/es from the following is A. I2(g) -> 2I(g) B. HCl(g) -> H(g) + Cl(g) C. H2O(l) -> H2O(g) D. C(s) + O2(g) -> CO2(g) E. Dissolution of ammonium chloride in water",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "content": "In alkaline medium, the reduction of permanganate anion involves a gain of _________ electrons.",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "content": "An aqueous solution of volume 300 cm3 contains 0.63 g of protein. The osmotic pressure of the solution at 300 K is 1.29 mbar. The molar mass of the protein is _________ g mol-1. Given: R = 0.083 L bar K-1 mol-1",
    "options": [],
    "answer": "40535"
  },
  {
    "section": "Chemistry",
    "content": "The specific conductance of 0.0025 M acetic acid is 5 × 10-5 S cm-1 at a certain temperature. The dissociation constant of acetic acid is ___________ × 10-7. (Nearest integer) Consider limiting molar conductivity of CH3COOH as 400 S cm2 mol-1",
    "options": [],
    "answer": "66"
  },
  {
    "section": "Chemistry",
    "content": "The number of incorrect statement/s from the following is A. The successive half lives of zero order reactions decreases with time. B. A substance appearing as reactant in the chemical equation may not affect the rate of reaction C. Order and molecularity of a chemical reaction can be a fractional number D. The rate constant units of zero and second order reaction are mol L-1 s-1 and mol-1 L s-1 respectively",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "content": "The difference in the oxidation state of Xe between the oxidised product of Xe formed on complete hydrolysis of XeF4 is ___________",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "content": "Let S = {z = x + iy : (2z - 3i)/(4z + 2i) is a real number}. Then which of the following is NOT correct?",
    "options": [
      "y + x2 + y2 ≠ -1/4",
      "(x, y) = (0, -1/2)",
      "x = 0",
      "y ∈ (-∞, -1/2) ∪ (-1/2, ∞)"
    ],
    "answer": "(x, y) = (0, -1/2)"
  },
  {
    "section": "Mathematics",
    "content": "Eight persons are to be transported from city A to city B in three cars of different makes. If each car can accommodate at most three persons, then the number of ways, in which they can be transported, is",
    "options": [
      "1120",
      "3360",
      "1680",
      "560"
    ],
    "answer": "1680"
  },
  {
    "section": "Mathematics",
    "content": "If Sn = 4 + 11 + 21 + 34 + 50 + ... to n terms, then 1 60 (S29 - S9) is equal to",
    "options": [
      "223",
      "226",
      "220",
      "227"
    ],
    "answer": "223"
  },
  {
    "section": "Mathematics",
    "content": "Let the number (22)^2022 + (2022)^22 leave the remainder α when divided by 3 and β when divided by 7. Then (α^2 + β^2) is equal to",
    "options": [
      "20",
      "13",
      "5",
      "10"
    ],
    "answer": "5"
  },
  {
    "section": "Mathematics",
    "content": "If the coefficients of x and x2 in (1 + x)^p (1 - x)^q are 4 and -5 respectively, then 2p + 3q is equal to",
    "options": [
      "60",
      "69",
      "66",
      "63"
    ],
    "answer": "63"
  },
  {
    "section": "Mathematics",
    "content": "Let S = { x ∈ (-𝜋, 𝜋) : 2x ≠ 𝜋/2, 9^(1 - tan^2 x) + 9^(tan^2 x) = 10 } and 𝛽 = ∑ x∈S tan^2 (x/3), then 1 6 (𝛽 - 14)^2 is equal to",
    "options": [
      "16",
      "8",
      "64",
      "32"
    ],
    "answer": "32"
  },
  {
    "section": "Mathematics",
    "content": "Let A be the point (1, 2) and B be any point on the curve x2 + y2 = 16. If the centre of the locus of the point P, which divides the line segment AB in the ratio 3 : 2 is the point C(𝛼, 𝛽), then the length of the line segment AC is",
    "options": [
      "3√5 5",
      "4√5 5",
      "2√5 5",
      "6√5 5"
    ],
    "answer": "3√5 5"
  },
  {
    "section": "Mathematics",
    "content": "Let a circle of radius 4 be concentric to the ellipse 15x2 + 19y2 = 285. Then the common tangents are inclined to the minor axis of the ellipse at the angle",
    "options": [
      "𝜋 3",
      "𝜋 6",
      "𝜋 4",
      "𝜋 12"
    ],
    "answer": "𝜋 3"
  },
  {
    "section": "Mathematics",
    "content": "The statement ~(p ∨ (~p ∧ q)) is equivalent to",
    "options": [
      "~p ∨ q",
      "p ∧ ~q",
      "~p ∧ q",
      "~p ∨ ~q"
    ],
    "answer": "p ∧ ~q"
  },
  {
    "section": "Mathematics",
    "content": "Let 𝜇 be the mean and 𝜎 be the standard deviation of the distribution Xi : 0, 1, 2, 3, 4, 5 fi : k+2, 2k, k^2-1, k^2-1, k^2+1, k-3 where ∑fi = 62. If [x] denotes the greatest integer ≤ x, then [𝜇^2 + 𝜎^2] is equal to",
    "options": [
      "9",
      "8",
      "7",
      "6"
    ],
    "answer": "8"
  },
  {
    "section": "Mathematics",
    "content": "Let A = {2, 3, 4} and B = {8, 9, 12}. Then the number of elements in the relation R = {((a1, b1), (a2, b2)) ∈ (A × B) × (A × B) : a1 divides b2 and a2 divides b1} is",
    "options": [
      "36",
      "24",
      "18",
      "12"
    ],
    "answer": "36"
  },
  {
    "section": "Mathematics",
    "content": "If A = [ (1/5!6!7!) (1/6!7!8!) (1/7!8!9!) ], then |adj(adj(2A))| is equal to",
    "options": [
      "2^20",
      "2^8",
      "2^12",
      "2^16"
    ],
    "answer": "2^16"
  },
  {
    "section": "Mathematics",
    "content": "Let g(x) = f(x) + f(1 - x) and f\"(x) > 0, x ∈ (0, 1). If g is decreasing in the interval (0, a) and increasing in the interval (a, 1), then tan^-1(2a) + tan^-1(1/a) + tan^-1((a+1)/a) is equal to",
    "options": [
      "𝜋",
      "3𝜋 4",
      "5𝜋 4",
      "3𝜋 2"
    ],
    "answer": "𝜋"
  },
  {
    "section": "Mathematics",
    "content": "For 𝛼, 𝛽, 𝛾, 𝛿 ∈ N, if ∫(x/e)^(2x) + (e/x)^(2x) / ((x/e)^x + (e/x)^x) loge x dx = 1/𝛼 (x/e)^(𝛽x) - 1/𝛾 (e/x)^(𝛿x) + C, where e = ∑(1/n!) and C is constant of integration, then 𝛼 + 2𝛽 + 3𝛾 - 4𝛿 is equal to",
    "options": [
      "1",
      "4",
      "-4",
      "-8"
    ],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "content": "Let f be a continuous function satisfying ∫[0, t^2] (f(x) + x^2) dx = 4/3 t^3, ∀ t > 0. Then f(𝜋^2/4) is equal to",
    "options": [
      "𝜋^2 (1 - 𝜋^2/16)",
      "-𝜋 (1 + 𝜋^3/16)",
      "𝜋 (1 - 𝜋^3/16)",
      "-𝜋^2 (1 + 𝜋^2/16)"
    ],
    "answer": "𝜋 (1 - 𝜋^3/16)"
  },
  {
    "section": "Mathematics",
    "content": "Let a = 2i + 7j - k, b = 3i + 5k and c = i - j + 2k. Let d be a vector which is perpendicular to both a and b, and c . d = 12. Then (-i + j - k) . (c × d) is equal to",
    "options": [
      "24",
      "44",
      "42",
      "48"
    ],
    "answer": "44"
  },
  {
    "section": "Mathematics",
    "content": "If the points P and Q are respectively the circumcenter and the orthocentre of a ∆ABC, then PA + PB + PC is equal to",
    "options": [
      "2 QP",
      "2 PQ",
      "PQ",
      "QP"
    ],
    "answer": "PQ"
  },
  {
    "section": "Mathematics",
    "content": "Let the image of the point P(1, 2, 6) in the plane passing through the points A(1, 2, 0), B(1, 4, 1) and C(0, 5, 1) be Q(𝛼, 𝛽, 𝛾). Then (𝛼^2 + 𝛽^2 + 𝛾^2) equal to",
    "options": [
      "65",
      "62",
      "76",
      "70"
    ],
    "answer": "65"
  },
  {
    "section": "Mathematics",
    "content": "Let the line (x)/1 = (6-y)/2 = (z+8)/5 intersect the lines (x-5)/4 = (y-7)/3 = (z+2)/1 and (x+3)/6 = (3-y)/3 = (z-6)/1 at the points A and B respectively. Then the distance of the mid-point of the line segment AB from the plane x - 2y + z = 14 is",
    "options": [
      "3",
      "11 3",
      "4",
      "10 3"
    ],
    "answer": "4"
  },
  {
    "section": "Mathematics",
    "content": "Let a die be rolled n times. Let the probability of getting odd numbers seven times be equal to the probability of getting odd numbers nine times. If the probability of getting even numbers twice is k/2^15, then k is equal to",
    "options": [
      "60",
      "15",
      "90",
      "30"
    ],
    "answer": "60"
  },
  {
    "section": "Mathematics",
    "content": "The sum of all the four-digit numbers that can be formed using all the digits 2, 1, 2, 3 is equal to ____________",
    "options": [],
    "answer": "26664"
  },
  {
    "section": "Mathematics",
    "content": "Suppose a1, a2, 2, a3, a4 be in an arithmetico-geometric progression. If the common ratio of the corresponding geometric progression is 2 and the sum of all 5 terms of the arithmetico-geometric progression is 49 2, then a4 is equal to ____________",
    "options": [],
    "answer": "16"
  },
  {
    "section": "Mathematics",
    "content": "Let the equations of two adjacent sides of a parallelogram ABCD be 2x - 3y = -23 and 5x + 4y = 23. If the equation of its one diagonal AC is 3x + 7y = 23 and the distance of A from the other diagonal is d, then 50d^2 is equal to ____________",
    "options": [],
    "answer": "529"
  },
  {
    "section": "Mathematics",
    "content": "Let S be the set of values of 𝜆, for which the system of equations 6𝜆x - 3y + 3z = 4𝜆^2, 2x + 6𝜆y + 4z = 1 and 3x + 2y + 3𝜆z = 𝜆 has no solution. Then, 12 ∑𝜆∈S |𝜆| is equal to ____________",
    "options": [],
    "answer": "24"
  },
  {
    "section": "Mathematics",
    "content": "If the domain of the function f(x) = sec^-1(2x/(5x+3)) is [𝛼, 𝛽) ∪ (𝛾, 𝛿], then 3𝛼 + 10𝛽 + 𝛾 + 21𝛿 is equal to ____________",
    "options": [],
    "answer": "24"
  },
  {
    "section": "Mathematics",
    "content": "In the figure, 𝜃1 + 𝜃2 = 𝜋/2 and √3 BE = 4AB. If the area of ∆CAB is 2√3 - 3 unit^2, when 𝜃2/𝜃1 is the largest, then the perimeter (in unit) of ∆CED is equal to ____________<br><div class='flex justify-center my-4'><img src='images/8/q86.png' alt='Question 86'></div>",
    "options": [],
    "answer": "6"
  },
  {
    "section": "Mathematics",
    "content": "Let the quadratic curve passing through the point (-1, 0) and touching the line y = x at (1, 1) be y = f(x). Then the x-intercept of the normal to the curve at the point (𝛼, 𝛼 + 1) in the first quadrant is ____________",
    "options": [],
    "answer": "11"
  },
  {
    "section": "Mathematics",
    "content": "If the area of the region { (x, y) : x^2 - 2 ≤ y ≤ x } is A, then 6A + 16√2 is equal to ____________",
    "options": [],
    "answer": "27"
  },
  {
    "section": "Mathematics",
    "content": "Let the tangent at any point P on a curve passing through the points (1, 1) and (1/10, 100), intersect positive x-axis and y-axis at the points A and B respectively. If PA : PB = 1 : k and y = y(x) is the solution of the differential equation e^(dy/dx) = kx + k/2, y(0) = k, then 4y(1) - 5 loge 3 is equal to ____________",
    "options": [],
    "answer": "5"
  },
  {
    "section": "Mathematics",
    "content": "Let the foot of perpendicular from the point A(4, 3, 1) on the plane P: x - y + 2z + 3 = 0 be N. If B(5, 𝛼, 𝛽), 𝛼, 𝛽 ∈ Z is a point on plane P such that the area of the triangle ABN is 3√2, then 𝛼^2 + 𝛽^2 + 𝛼𝛽 is equal to ____________",
    "options": [],
    "answer": "7"
  }
],

9:[
  {
    "section": "Physics",
    "question_number": 1,
    "content": "Given below are two statements:\nStatement I: Astronomical unit (Au), Parsec (Pc) and Light year (ly) are units for measuring astronomical distances.\nStatement II: \\( Au < Parsec (Pc) < ly \\)\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    "options": [
      "Both Statements I and Statements II are incorrect",
      "Statements I is correct but Statements II is incorrect",
      "Both Statements I and Statements II are correct",
      "Statements I is incorrect but Statements II is correct"
    ],
    "answer": "Statements I is correct but Statements II is incorrect"
  },
  {
    "section": "Physics",
    "question_number": 2,
    "content": "From the v-t graph shown, the ratio of distance to displacement in 25 s of motion is:<br><img src='images/9/q2.png' alt='Question 2'>",
    "options": [
      "1",
      "3/5",
      "5/3",
      "1/2"
    ],
    "answer": "5/3"
  },
  {
    "section": "Physics",
    "question_number": 3,
    "content": "A coin placed on a rotating table just slips when it is placed at a distance of 1 cm from the centre. If the angular velocity of the table is halved, it will just slip when placed at a distance of:",
    "options": [
      "8 cm",
      "4 cm",
      "1 cm",
      "2 cm"
    ],
    "answer": "4 cm"
  },
  {
    "section": "Physics",
    "question_number": 4,
    "content": "An average force of 125 N is applied on a machine gun firing bullets each of mass 10 g at the speed of 250 m \\(s^{-1}\\) to keep it in position. The number of bullets fired per second by the machine gun is:",
    "options": [
      "50",
      "25",
      "100",
      "5"
    ],
    "answer": "50"
  },
  {
    "section": "Physics",
    "question_number": 5,
    "content": "The radii of two planets A and B are R and 4R and their densities are \\(\\rho\\) and \\(\\rho/3\\) respectively. The ratio of acceleration due to gravity at their surfaces \\(g_{A} : g_{B}\\) will be",
    "options": [
      "4:3",
      "1:16",
      "3:16",
      "3:4"
    ],
    "answer": "3:4"
  },
  {
    "section": "Physics",
    "question_number": 6,
    "content": "1 kg of water at \\(100^{\\circ}C\\) is converted into steam at \\(100^{\\circ}C\\) by boiling at atmospheric pressure. The volume of water changes from \\(1.00 \\times 10^{-3} m^{3}\\) as a liquid to \\(1.671 m^{3}\\) as steam. The change in internal energy of the system during the process will be (Given latent heat of vaporisation = 2257 kJ/kg, Atmospheric pressure = \\(1 \\times 10^{5}\\) Pa)",
    "options": [
      "-2426 kJ",
      "+2090 kJ",
      "-2090 kJ",
      "+2476 kJ"
    ],
    "answer": "+2090 kJ"
  },
  {
    "section": "Physics",
    "question_number": 7,
    "content": "On a temperature scale 'X', the boiling point of water is \\(65^{\\circ}X\\) and the freezing point is \\(-15^{\\circ}X\\) Assuming that the X scale is linear. The equivalent temperature corresponding to \\(-95^{\\circ}X\\) on the Fahrenheit scale would be",
    "options": [
      "-112^{\\circ}F",
      "-48^{\\circ}F",
      "-148^{\\circ}F",
      "-63^{\\circ}F"
    ],
    "answer": "-148^{\\circ}F"
  },
  {
    "section": "Physics",
    "question_number": 8,
    "content": "Three vessels of equal volume contain gases at the same temperature and pressure. The first vessel contains neon (monoatomic), the second contains chlorine (diatomic) and third contains uranium hexafluoride (polyatomic). Arrange these on the basis of their root mean square speed \\(v_{rms}\\) and choose the correct answer from the options given below:",
    "options": [
      "\\(v_{rms}(mono) > v_{rms}(dia) > v_{rms}(poly)\\)",
      "\\(v_{rms}(mono) = v_{rms}(dia) = v_{rms}(poly)\\)",
      "\\(v_{rms}(mono) < v_{rms}(dia) < v_{rms}(poly)\\)",
      "\\(v_{rms}(dia) < v_{rms}(poly) < v_{rms}(mono)\\)"
    ],
    "answer": "\\(v_{rms}(mono) > v_{rms}(dia) > v_{rms}(poly)\\)"
  },
  {
    "section": "Physics",
    "question_number": 9,
    "content": "The variation of kinetic energy (KE) of a particle executing simple harmonic motion with the displacement (x) starting from mean position to extreme position (A) is given by<br><img src='images/9/q9.png' alt='Question 9'>",
    "options": [
      "Graph 1",
      "Graph 2",
      "Graph 3",
      "Graph 4"
    ],
    "answer": "Graph 3"
  },
  {
    "section": "Physics",
    "question_number": 10,
    "content": "The electric field in an electromagnetic wave is given as \\(\\vec{E}=20 \\sin(\\omega t-\\frac{x}{c})\\vec{j}N C^{-1}\\), where \\(\\omega\\) and c are angular frequency and velocity of electromagnetic wave respectively. The energy contained in a volume of \\(5 \\times 10^{-4}m^{3}\\) will be (Given \\(\\epsilon_{0}=8.85 \\times 10^{-12}C^{2}N^{-1}m^{-2})\\)",
    "options": [
      "\\(88.5 \\times 10^{-13}\\) J",
      "\\(17.7 \\times 10^{-13}\\) J",
      "\\(28.5 \\times 10^{-13}\\) J",
      "\\(8.85 \\times 10^{-13}\\) J"
    ],
    "answer": "\\(8.85 \\times 10^{-13}\\) J"
  },
  {
    "section": "Physics",
    "question_number": 11,
    "content": "A parallel plate capacitor of capacitance 2 F is charged to a potential V. The energy stored in the capacitor is \\(E_{1}\\). The capacitor is now connected to another uncharged identical capacitor in parallel combination. The energy stored in the combination is \\(E_{2}\\). The ratio \\(E_{2}/E_{1}\\) is",
    "options": [
      "2:1",
      "2:3",
      "1:2",
      "1:4"
    ],
    "answer": "1:2"
  },
  {
    "section": "Physics",
    "question_number": 12,
    "content": "Two identical heater filaments are connected first in parallel and then in series. At the same applied voltage, the ratio of heat produced in same time for parallel to series will be:",
    "options": [
      "1:4",
      "2:1",
      "4:1",
      "1:2"
    ],
    "answer": "4:1"
  },
  {
    "section": "Physics",
    "question_number": 13,
    "content": "The current sensitivity of moving coil galvanometer is increased by 25%. This increase is achieved only by changing in the number of turns of coils and area of cross section of the wire while keeping the resistance of galvanometer coil constant. The percentage change in the voltage sensitivity will be:",
    "options": [
      "+25%",
      "-50%",
      "-25%",
      "Zero"
    ],
    "answer": "+25%"
  },
  {
    "section": "Physics",
    "question_number": 14,
    "content": "The free space inside a current carrying toroid is filled with a material of susceptibility \\(2 \\times 10^{-2}\\). The percentage increase in the value of magnetic field inside the toroid will be",
    "options": [
      "0.2%",
      "0.1%",
      "2%",
      "1%"
    ],
    "answer": "2%"
  },
  {
    "section": "Physics",
    "question_number": 15,
    "content": "As per the given graph, choose the correct representation for curve A and curve B. {Where \\(X_{c}=\\) Reactance of pure capacitive circuit connected with A.C. source, \\(X_{L}=\\) Reactance of pure inductive circuit connected with A.C. source, \\(R=\\) Impedance of pure resistive circuit connected with A.C. source, \\(Z=\\) Impedance of the LCR series circuit }<br><img src='images/9/q15.png' alt='Question 15'>",
    "options": [
      "\\(A=X_{C}, B=R\\)",
      "\\(A=X_{L}, B=R\\)",
      "\\(A=X_{L}, B=Z\\)",
      "\\(A=X_{C}, B=X_{L}\\)"
    ],
    "answer": "\\(A=X_{C}, B=X_{L}\\)"
  },
  {
    "section": "Physics",
    "question_number": 16,
    "content": "The critical angle for a denser-rarer interface is \\(45^{\\circ}\\). The speed of light in rarer medium is \\(3 \\times 10^{8}\\) m \\(s^{-1}\\). The speed of light in the denser medium is:",
    "options": [
      "\\(3.12 \\times 10^{7}\\) m \\(s^{-1}\\)",
      "\\(5 \\times 10^{7}\\) m \\(s^{-1}\\)",
      "\\(2.12 \\times 10^{8}\\) m \\(s^{-1}\\)",
      "\\(\\sqrt{2} \\times 10^{8}\\) m \\(s^{-1}\\)"
    ],
    "answer": "\\(2.12 \\times 10^{8}\\) m \\(s^{-1}\\)"
  },
  {
    "section": "Physics",
    "question_number": 17,
    "content": "A metallic surface is illuminated with radiation of wavelength \\(\\lambda\\), the stopping potential is \\(V_{0}\\). If the same surface is illuminated with radiation of wavelength \\(2\\lambda\\), the stopping potential becomes \\(V_{0}/4\\). The threshold wavelength for this metallic surface will be",
    "options": [
      "3\\(\\lambda\\)",
      "4\\(\\lambda\\)",
      "\\(\\frac{3}{2}\\lambda\\)",
      "\\(\\frac{\\lambda}{4}\\)"
    ],
    "answer": "3\\(\\lambda\\)"
  },
  {
    "section": "Physics",
    "question_number": 18,
    "content": "Two radioactive elements A and B initially have same number of atoms. The half life of A is same as the average life of B. If \\(\\lambda_{A}\\) and \\(\\lambda_{B}\\) are decay constants of A and B respectively, then choose the correct relation from the given options.",
    "options": [
      "\\(\\lambda_{A} \\ln 2 = \\lambda_{B}\\)",
      "\\(\\lambda_{A} = \\lambda_{B}\\)",
      "\\(\\lambda_{A} = \\lambda_{B} \\ln 2\\)",
      "\\(\\lambda_{A} = 2\\lambda_{B}\\)"
    ],
    "answer": "\\(\\lambda_{A} = \\lambda_{B} \\ln 2\\)"
  },
  {
    "section": "Physics",
    "question_number": 19,
    "content": "The logic performed by the circuit shown in figure is equivalent to<br><img src='images/9/q19.png' alt='Question 19'>",
    "options": [
      "AND",
      "NOR",
      "OR",
      "NAND"
    ],
    "answer": "AND"
  },
  {
    "section": "Physics",
    "question_number": 20,
    "content": "A transmitting antenna is kept on the surface of the earth. The minimum height of receiving antenna required to receive the signal in line of sight at 4 km distance from it is \\(x \\times 10^{-2}\\) m. The value of x is (Let, radius of earth \\(R=6400\\) km)",
    "options": [
      "125",
      "1250",
      "12.5",
      "1.25"
    ],
    "answer": "125"
  },
  {
    "section": "Physics",
    "question_number": 21,
    "content": "A projectile fired at 30° to the ground is observed to be at same height at time 3 s and 5 s after projection, during its flight. The speed of projection of the projectile is __ m \\(s^{-1}\\). (Given \\(g=10 m s^{-2}\\))",
    "options": [],
    "answer": "80"
  },
  {
    "section": "Physics",
    "question_number": 22,
    "content": "A force \\(\\vec{F}=2+3x\\hat{i}\\) acts on a particle in the x direction where F is in Newton and x is in meter. The work done by this force during a displacement from \\(x=0\\) to \\(x=4\\) m is __ J.",
    "options": [],
    "answer": "32"
  },
  {
    "section": "Physics",
    "question_number": 23,
    "content": "A solid sphere of mass 500 g radius 5 cm is rotated about one of its diameter with angular speed of 10 rad \\(s^{-1}\\). If the moment of inertia of the sphere about its tangent is \\(x \\times 10^{-2}\\) times its angular momentum about the diameter. Then the value of x will be __",
    "options": [],
    "answer": "35"
  },
  {
    "section": "Physics",
    "question_number": 24,
    "content": "The length of a wire becomes \\(l_{1}\\) and \\(l_{2}\\) when 100 N and 120 N tension are applied respectively. If \\(10l_{2}=11l_{1}\\), then the natural length of wire will be \\(\\frac{1}{x}l_{1}\\). Here the value of x is __",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Physics",
    "question_number": 25,
    "content": "The equation of wave is given by \\(Y=10^{-2} \\sin 2\\pi(160t-0.5x+\\frac{\\pi}{4})\\) where x and Y are in m and t in s. The speed of the wave is __ km \\(h^{-1}\\).",
    "options": [],
    "answer": "1152"
  },
  {
    "section": "Physics",
    "question_number": 26,
    "content": "As shown in the figure, a configuration of two equal point charges \\(q_{0}=+2\\mu C\\) is placed on an inclined plane. Mass of each point charge is 20 g. Assume that there is no friction between charge and plane. For the system of two point charges to be in equilibrium (at rest) the height \\(h=x \\times 10^{-3}\\) m. The value of x is __. (Take \\(\\frac{1}{4\\pi\\epsilon_{0}}=9 \\times 10^{9}\\) N \\(m^{2} C^{-2}\\), \\(g=10\\) m \\(s^{-2}\\))<br><img src='images/9/q26.png' alt='Question 26'>",
    "options": [],
    "answer": "300"
  },
  {
    "section": "Physics",
    "question_number": 27,
    "content": "In the circuit diagram shown in figure given below, the current flowing through resistance 3\\(\\Omega\\) is \\(\\frac{x}{3}\\) A. The value of x is __<br><img src='images/9/q27.png' alt='Question 27'>",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Physics",
    "question_number": 28,
    "content": "The magnetic field B crossing normally a square metallic plate of area 4 \\(m^{2}\\) is changing with time as shown in figure. The magnitude of induced emf in the plate during \\(t=2\\) s to \\(t=4\\) s, is __ mV.<br><img src='images/9/q28.png' alt='Question 28'>",
    "options": [],
    "answer": "8"
  },
  {
    "section": "Physics",
    "question_number": 29,
    "content": "The radius of curvature of each surface of a convex lens having refractive index 1.8 is 20 cm. The lens is now immersed in a liquid of refractive index 1.5. The ratio of power of lens in air to its power in the liquid will be x: 1. The value of x is __",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Physics",
    "question_number": 30,
    "content": "A monochromatic light is incident on a hydrogen sample in ground state. Hydrogen atoms absorb a fraction of light and subsequently emit radiation of six different wavelengths. The frequency of incident light is \\(x \\times 10^{15}\\) Hz. The value of x is __. (Given \\(h=4.25 \\times 10^{-15}\\) eVs)",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "question_number": 31,
    "content": "25 mL of silver nitrate solution (1M) is added dropwise to 25 mL of potassium iodide (1.05 M) solution. The ion(s) present in very small quantity in the solution is/are",
    "options": [
      "I only",
      "\\(K^{+}\\) only",
      "\\(NO_{3}^{-}\\)",
      "\\(Ag^{+}\\) and I both"
    ],
    "answer": "\\(Ag^{+}\\) and I both"
  },
  {
    "section": "Chemistry",
    "question_number": 32,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:\nAssertion A: In the photoelectric effect, the electrons are ejected from the metal surface as soon as the beam of light of frequency greater than threshold frequency strikes the surface.\nReason R: When the photon of any energy strikes an electron in the atom, transfer of energy from the photon to the electron takes place.\nIn the light of the above statements, choose the most appropriate answer from the options given below :",
    "options": [
      "Both A and R are correct and R is the correct explanation of A",
      "A is correct but R is not correct",
      "Both A and R are correct but R is NOT the correct explanation of A",
      "A is not correct but R is correct"
    ],
    "answer": "A is correct but R is not correct"
  },
  {
    "section": "Chemistry",
    "question_number": 33,
    "content": "For compound having the formula \\(GaAlCl_{4}\\), the correct option from the following is",
    "options": [
      "Ga is coordinated with Cl in \\(GaAlCl_{4}\\)",
      "Ga is more electronegative than Al and is present as a cationic part of the salt \\(GaAlCl_{4}\\)",
      "Cl forms bond with both Al and Ga in \\(GaAlCl_{4}\\)",
      "Oxidation state of Ga in the salt \\(GaAlCl_{4}\\) is +3"
    ],
    "answer": "Ga is more electronegative than Al and is present as a cationic part of the salt \\(GaAlCl_{4}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 34,
    "content": "For elements B, C, N, Li, Be, O and F, the correct order of first ionisation enthalpy is",
    "options": [
      "\\(Li < Be < B < C < O < N < F\\)",
      "\\(B < Li < Be < C < N < O < F\\)",
      "\\(Li < Be < B < C < N < O < F\\)",
      "\\(Li < B < Be < C < O < N < F\\)"
    ],
    "answer": "\\(Li < B < Be < C < O < N < F\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 35,
    "content": "Match List-I with List-II:\nList-I (Species): A. \\(H_{3}O^{+}\\) B. Acetylide anion C. \\(NH_{4}^{+}\\) D. \\(ClO_{2}^{-}\\)\nList-II (Geometry/Shape): I. Tetrahedral II. Linear III. Pyramidal IV. Bent\nChoose the correct answer from the options given below:",
    "options": [
      "A(III), B(IV), C(I), D(II)",
      "A(III), B(I), C(II), D(IV)",
      "A(III), B(II), C(I), D(IV)",
      "A(III), B(IV), C(II), D(I)"
    ],
    "answer": "A(III), B(II), C(I), D(IV)"
  },
  {
    "section": "Chemistry",
    "question_number": 36,
    "content": "Match List-I with List-II:\nList-I: A. K B. KCl C. KOH D. Li\nList-II: I. Thermonuclear reactions II. Fertilizer III. Sodium potassium pump IV. Absorbent of \\(CO_{2}\\)",
    "options": [
      "A(III), B(II), C(IV), D(I)",
      "A(III), B(IV), C(II), D(I)",
      "A(IV), B(I), C(III), D(II)",
      "A(IV), B(III), C(I), D(II)"
    ],
    "answer": "A(III), B(II), C(IV), D(I)"
  },
  {
    "section": "Chemistry",
    "question_number": 37,
    "content": "Find out the correct statement from the options given below for the reactions shown in the figure.<br><img src='images/9/q37.png' alt='Question 37'>",
    "options": [
      "Reaction (i) is of \\(2^{nd}\\) order and reaction (ii) is of \\(1^{st}\\) order",
      "Reactions (i) and (ii) both are of \\(2^{nd}\\) order",
      "Reactions (i) is of \\(1^{st}\\) order and reaction (ii) is of \\(2^{nd}\\) order",
      "Reaction (i) and (ii) both are of \\(1^{st}\\) order"
    ],
    "answer": "Reactions (i) is of \\(1^{st}\\) order and reaction (ii) is of \\(2^{nd}\\) order"
  },
  {
    "section": "Chemistry",
    "question_number": 38,
    "content": "Thin layer chromatography of a mixture shows the following observation: The correct order of elution in the silica gel column chromatography is<br><img src='images/9/q38.png' alt='Question 38'>",
    "options": [
      "B, A, C",
      "B, C, A",
      "A, C, B",
      "C, A, B"
    ],
    "answer": "A, C, B"
  },
  {
    "section": "Chemistry",
    "question_number": 39,
    "content": "Arrange the following compounds in increasing order of rate of aromatic electrophilic substitution reaction.<br><img src='images/9/q39.png' alt='Question 39'>",
    "options": [
      "d, b, c, a",
      "d, b, a, c",
      "b, c, a, d",
      "c, a, b, d"
    ],
    "answer": "c, a, b, d"
  },
  {
    "section": "Chemistry",
    "question_number": 40,
    "content": "Given below are two statements:\nStatement-I: If BOD is 4 ppm and dissolved oxygen is 8 ppm, then it is a good quality water.\nStatement-II: If the concentration of zinc and nitrate salts are 5 ppm each, then it can be a good quality water.\nIn the light of the above statements, choose the most appropriate answer from the options given below :",
    "options": [
      "Statement I is correct but Statement II is incorrect",
      "Statement I is incorrect but Statement II is correct",
      "Both the statements I and II are incorrect",
      "Both the statements I and II are correct"
    ],
    "answer": "Both the statements I and II are correct"
  },
  {
    "section": "Chemistry",
    "question_number": 41,
    "content": "In the extraction process of copper, the product obtained after carrying out the reactions\n(i) \\(2Cu_{2}S + 3O_{2} \\rightarrow 2Cu_{2}O + 2SO_{2}\\)\n(ii) \\(2Cu_{2}O + Cu_{2}S \\rightarrow 6Cu + SO_{2}\\)\nis called",
    "options": [
      "Blister copper",
      "Reduced copper",
      "Copper scrap",
      "Copper matte"
    ],
    "answer": "Blister copper"
  },
  {
    "section": "Chemistry",
    "question_number": 42,
    "content": "Given below are two statements:\nStatement-I: Methane and steam passed over a heated Ni catalyst produces hydrogen gas.\nStatement-II: Sodium nitrite reacts with \\(NH_{4}Cl\\) to give \\(H_{2}O\\), \\(N_{2}\\) and NaCl.\nIn the light of the above statements, choose the most appropriate answer from the options given below :",
    "options": [
      "Statement I is incorrect but Statement II is correct",
      "Both the statements I and II are incorrect",
      "Statement I is correct but Statement II is incorrect",
      "Both the statements I and II are correct"
    ],
    "answer": "Both the statements I and II are correct"
  },
  {
    "section": "Chemistry",
    "question_number": 43,
    "content": "When a solution of mixture having two inorganic salts was treated with freshly prepared ferrous sulphate in acidic medium, a dark brown ring was formed whereas on treatment with neutral \\(FeCl_{3}\\) it gave deep red colour which disappeared on boiling and a brown red ppt was formed. The mixture contains",
    "options": [
      "\\(SO_{3}^{2-} \\& CH_{3}COO^{-}\\)",
      "\\(CH_{3}COO^{-} \\& NO_{3}^{-}\\)",
      "\\(SO_{3}^{2-} \\& C_{2}O_{4}^{2-}\\)",
      "\\(C_{2}O_{4}^{2-} \\& NO_{3}^{-}\\)"
    ],
    "answer": "\\(CH_{3}COO^{-} \\& NO_{3}^{-}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 44,
    "content": "The complex that dissolves in water is",
    "options": [
      "\\((NH_{4})_{3}[As(Mo_{3}O_{10})_{4}]\\)",
      "\\(Fe_{4}[Fe(CN)_{6}]_{3}\\)",
      "\\(K_{3}[Co(NO_{2})_{6}]\\)",
      "\\([Fe_{3}(OH)_{2}(OAc)_{6}]Cl\\)"
    ],
    "answer": "\\([Fe_{3}(OH)_{2}(OAc)_{6}]Cl\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 45,
    "content": "The set which does not have ambidentate ligand(s) is",
    "options": [
      "\\(C_{2}O_{4}^{2-}\\), ethylene diamine, \\(H_{2}O\\)",
      "\\(EDTA^{4-}\\), NCS, \\(C_{2}O_{4}^{2-}\\)",
      "\\(NO_{2}^{-}\\), \\(C_{2}O_{4}^{2-}\\), \\(EDTA^{4-}\\)",
      "\\(C_{2}O_{4}^{2-}\\), \\(NO_{2}^{-}\\), NCS"
    ],
    "answer": "\\(C_{2}O_{4}^{2-}\\), ethylene diamine, \\(H_{2}O\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 46,
    "content": "Which of the following complex has a possibility to exist as meridional isomer?",
    "options": [
      "\\([Co(NH_{3})_{3}(NO_{2})_{3}]\\)",
      "\\([Pt(NH_{3})_{2}Cl_{2}]\\)",
      "\\([Co(en)_{2}Cl_{2}]\\)",
      "\\([Co(en)_{3}]\\)"
    ],
    "answer": "\\([Co(NH_{3})_{3}(NO_{2})_{3}]\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 47,
    "content": "L-isomer of tetrose X \\((C_{4}H_{8}O_{4})\\) gives positive Schiff's test and has two chiral carbons. On acetylation 'X' yields triacetate. 'X' also undergoes following reactions. 'A' and 'B' are:<br><img src='images/9/q47.png' alt='Question 47'>",
    "options": [
      "Structure 1",
      "Structure 2",
      "Structure 3",
      "Structure 4"
    ],
    "answer": "Structure 2"
  },
  {
    "section": "Chemistry",
    "question_number": 48,
    "content": "'A' and 'B' in the above reactions are:<br><img src='images/9/q48.png' alt='Question 48'>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  },
  {
    "section": "Chemistry",
    "question_number": 49,
    "content": "Identify the Major Product 'X'.<br><img src='images/9/q49.png' alt='Question 49'>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 1"
  },
  {
    "section": "Chemistry",
    "question_number": 50,
    "content": "The polymer X consists of linear molecules and is closely packed. It is prepared in the presence of triethylaluminium and titanium tetrachloride under low pressure. The polymer X is",
    "options": [
      "High density polythene",
      "Polyacrylonitrile",
      "Low density polythene",
      "Polytetrafluoroethane"
    ],
    "answer": "High density polythene"
  },
  {
    "section": "Chemistry",
    "question_number": 51,
    "content": "A solution of sugar is obtained by mixing 200 g of its 25% solution and 500 g of its 40% solution (both by mass). The mass percentage of the resulting sugar solution is __ (Nearest integer)",
    "options": [],
    "answer": "36"
  },
  {
    "section": "Chemistry",
    "question_number": 52,
    "content": "Solid fuel used in rocket is a mixture of \\(Fe_{2}O_{3}\\) and Al (in ratio 1: 2). The heat evolved (kJ) per gram of the mixture is __ (Nearest integer)\nGiven \\(\\Delta H_{f}^{0}(Al_{2}O_{3}) = -1700\\) kJ \\(mol^{-1}\\), \\(\\Delta H_{f}^{0}(Fe_{2}O_{3}) = -840\\) kJ \\(mol^{-1}\\)\nMolar mass of Fe, Al and O are 56, 27 and 16 g \\(mol^{-1}\\) respectively",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 53,
    "content": "A mixture of one mole of \\(H_{2}O\\) and 1 mole of CO is taken in a 10 litre container and heated to 725 K. At equilibrium 40% of water by mass reacts with carbon monoxide according to the equation: \\(CO(g) + H_{2}O(g) \\rightleftharpoons CO_{2}(g) + H_{2}(g)\\). The equilibrium constant \\(K_{c} \\times 10^{2}\\) for the reaction is __ (Nearest integer)",
    "options": [],
    "answer": "44"
  },
  {
    "section": "Chemistry",
    "question_number": 54,
    "content": "The number of hyperconjugation structures involved to stabilize carbocation formed in the above reaction is __<br><img src='images/9/q54.png' alt='Question 54'>",
    "options": [],
    "answer": "7"
  },
  {
    "section": "Chemistry",
    "question_number": 55,
    "content": "An atomic substance A of molar mass 12 g \\(mol^{-1}\\) has a cubic crystal structure with edge length of 300 pm. The no. of atoms present in one unit cell of A is __ (Nearest integer)\nGiven the density of A is 3.0 g \\(cm^{-3}\\) and \\(N_{A}=6.02 \\times 10^{23} mol^{-1}\\)",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 56,
    "content": "0.004 M \\(K_{2}SO_{4}\\) solution is isotonic with 0.01 M glucose solution. Percentage dissociation of \\(K_{2}SO_{4}\\) is __ (Nearest integer)",
    "options": [],
    "answer": "75"
  },
  {
    "section": "Chemistry",
    "question_number": 57,
    "content": "In an electrochemical reaction of lead, at standard temperature, if \\(E_{(Pb^{2+}/Pb)}^{0} = m\\) Volt and \\(E_{(Pb^{4+}/Pb)}^{0} = n\\) Volt, then the value of \\(E_{(Pb^{2+}/Pb^{4+})}^{0}\\) is given by \\(m - xn\\). The value of x is __",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "question_number": 58,
    "content": "\\(KClO_{3} + 6FeSO_{4} + 3H_{2}SO_{4} \\rightarrow KCl + 3Fe_{2}(SO_{4})_{3} + 3H_{2}O\\)\nThe above reaction was studied at 300 K by monitoring the concentration of \\(FeSO_{4}\\) in which initial concentration was 10 M and after half an hour became 8.8 M. The rate of production of \\(Fe_{2}(SO_{4})_{3}\\) is \\(__ \\times 10^{-6}\\) mol \\(L^{-1} s^{-1}\\) (Nearest integer)",
    "options": [],
    "answer": "333"
  },
  {
    "section": "Chemistry",
    "question_number": 59,
    "content": "The ratio of spin-only magnetic moment values \\(\\mu_{eff}[Cr(CN)_{6}]^{3-} / \\mu_{eff}[Cr(H_{2}O)_{6}]^{3+}\\) is __",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "question_number": 60,
    "content": "The ratio x/y on completion of the above reaction is __<br><img src='images/9/q60.png' alt='Question 60'>",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 61,
    "content": "The number of integral solutions x of \\(\\log_{(x+\\frac{7}{2})} (\\frac{x-7}{2x-3})^{2} \\ge 0\\) is",
    "options": [
      "7",
      "8",
      "6",
      "5"
    ],
    "answer": "6"
  },
  {
    "section": "Mathematics",
    "question_number": 62,
    "content": "Let \\(w_{1}\\) be the point obtained by the rotation of \\(z_{1}=5+4i\\) about the origin through a right angle in the anticlockwise direction, and \\(w_{2}\\) be the point obtained by the rotation of \\(z_{2}=3+5i\\) about the origin through a right angle in the clockwise direction. Then the principal argument of \\(w_{1}-w_{2}\\) is equal to",
    "options": [
      "\\(\\pi - \\tan^{-1}\\frac{8}{9}\\)",
      "\\(-\\pi + \\tan^{-1}\\frac{33}{5}\\)",
      "\\(-\\pi + \\tan^{-1}\\frac{8}{9}\\)",
      "\\(\\pi - \\tan^{-1}\\frac{33}{5}\\)"
    ],
    "answer": "\\(\\pi - \\tan^{-1}\\frac{8}{9}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 63,
    "content": "The number of triplets (x, y, z) where x, y, z are distinct non negative integers satisfying \\(x+y+z=15\\), is",
    "options": [
      "80",
      "136",
      "114",
      "92"
    ],
    "answer": "114"
  },
  {
    "section": "Mathematics",
    "question_number": 64,
    "content": "Let \\(x_{1},x_{2},...,x_{100}\\) be in an arithmetic progression, with \\(x_{1}=2\\) and their mean equal to 200. If \\(y_{i}=i(x_{i}-i), 1 \\le i \\le 100\\), then the mean of \\(y_{1},y_{2},...,y_{100}\\) is",
    "options": [
      "10100",
      "10101.50",
      "10049.50",
      "10051.50"
    ],
    "answer": "10049.50"
  },
  {
    "section": "Mathematics",
    "question_number": 65,
    "content": "The number of elements in the set \\(S=\\{\\theta \\in [0,2\\pi]: 3\\cos^{4}\\theta-5\\cos^{2}\\theta-2\\sin^{6}\\theta+2=0\\}\\) is",
    "options": [
      "10",
      "8",
      "12",
      "9"
    ],
    "answer": "9"
  },
  {
    "section": "Mathematics",
    "question_number": 66,
    "content": "Consider ellipses \\(E_{k}:kx^{2}+k^{2}y^{2}=1\\), \\(k=1,2,...,20\\). Let \\(C_{k}\\) be the circle which touches the four chords joining the end points (one on minor axis and another on major axis) of the ellipse \\(E_{k}\\). If \\(r_{k}\\) is the radius of the circle \\(C_{k}\\) then the value of \\(\\sum_{k=1}^{20} \\frac{1}{r_{k}^{2}}\\) is",
    "options": [
      "3080",
      "2870",
      "3210",
      "3320"
    ],
    "answer": "3080"
  },
  {
    "section": "Mathematics",
    "question_number": 67,
    "content": "Let R be a rectangle given by the lines \\(x=0\\), \\(x=2\\), \\(y=0\\) and \\(y=5\\). Let \\(A(\\alpha, 0)\\) and \\(B(0, \\beta)\\), \\(\\alpha \\in [0,2]\\) and \\(\\beta \\in [0,5]\\) be such that the line segment AB divides the area of the rectangle R in the ratio 4: 1. Then, the mid-point of AB lies on a",
    "options": [
      "straight line",
      "parabola",
      "hyperbola",
      "circle"
    ],
    "answer": "hyperbola"
  },
  {
    "section": "Mathematics",
    "question_number": 68,
    "content": "Let sets A and B have 5 elements each. Let the mean of the elements in sets A and B be 5 and 8 respectively and the variance of the elements in sets A and B be 12 and 20 respectively. A new set C of 10 elements is formed by subtracting 3 from each element of A and adding 2 to each element of B. Then the sum of the mean and variance of the elements of C is",
    "options": [
      "40",
      "32",
      "38",
      "36"
    ],
    "answer": "38"
  },
  {
    "section": "Mathematics",
    "question_number": 69,
    "content": "An organization awarded 48 medals in event 'A', 25 in event 'B' and 18 in event 'C'. If these medals went to total 60 men and only five men got medals in all the three events, then, how many received medals in exactly two of three events?",
    "options": [
      "15",
      "21",
      "10",
      "9"
    ],
    "answer": "21"
  },
  {
    "section": "Mathematics",
    "question_number": 70,
    "content": "Let A be a \\(2 \\times 2\\) matrix with real entries such that \\(A^{T}=\\alpha A+I\\), where \\(\\alpha \\in \\mathbb{R}-\\{-1,1\\}\\). If \\(\\det(A^{2}-A)=4\\), the sum of all possible values of \\(\\alpha\\) is equal to",
    "options": [
      "0",
      "2",
      "\\(5/2\\)",
      "\\(3/2\\)"
    ],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 71,
    "content": "Let \\(f(x)=[x^{2}-x]+|-x+[x]|\\), where \\(x \\in \\mathbb{R}\\) and [t] denotes the greatest integer less than or equal to t. Then, f is",
    "options": [
      "continuous at x=0, but not continuous at x=1",
      "continuous at x=1, but not continuous at x=0",
      "continuous at x=0 and x=1",
      "not continuous at x=0 and x=1"
    ],
    "answer": "continuous at x=1, but not continuous at x=0"
  },
  {
    "section": "Mathematics",
    "question_number": 72,
    "content": "Let \\(f:[2,4] \\rightarrow \\mathbb{R}\\) be a differentiable function such that \\((x \\log x) f'(x) + (\\log x) f(x) + f(x) \\ge 1\\), \\(x \\in [2,4]\\) with \\(f(2)=\\frac{1}{2}\\) and \\(f(4)=\\frac{1}{4}\\). Consider the following two statements:\n(A) \\(f(x) \\le 1\\) for all \\(x \\in [2,4]\\)\n(B) \\(f(x) \\ge 1/8\\) for all \\(x \\in [2,4]\\)\nThen,",
    "options": [
      "Neither statement (A) nor statement (B) is true",
      "Only statement (B) is true",
      "Both the statements (A) and (B) are true",
      "Only statement (A) is true"
    ],
    "answer": "Both the statements (A) and (B) are true"
  },
  {
    "section": "Mathematics",
    "question_number": 73,
    "content": "The value of the integral \\(\\int_{-\\log_{e}2}^{\\log_{e}2} e^{x}(\\log_{e}(e^{x}+\\sqrt{1+e^{2x}}))dx\\) is equal to",
    "options": [
      "\\(\\log_{e}(\\frac{(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)",
      "\\(\\log_{e}(\\frac{\\sqrt{2}(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)",
      "\\(\\log_{e}(\\frac{2(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})-\\frac{\\sqrt{5}}{2}\\)",
      "\\(\\log_{e}(\\frac{\\sqrt{2}(3-\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)"
    ],
    "answer": "\\(\\log_{e}(\\frac{(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 74,
    "content": "Area of the region \\(\\{(x, y): x^{2}+(y-2)^{2} \\le 4, x^{2} \\ge 2y\\}\\) is",
    "options": [
      "\\(\\pi + \\frac{8}{3}\\)",
      "\\(2\\pi + \\frac{16}{3}\\)",
      "\\(\\pi - \\frac{8}{3}\\)",
      "\\(2\\pi - \\frac{16}{3}\\)"
    ],
    "answer": "\\(2\\pi - \\frac{16}{3}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 75,
    "content": "Let \\(y=y(x)\\) be a solution curve of the differential equation, \\((1-x^{2}y^{2})dx=y dx+x dy\\). If the line \\(x=1\\) intersects the curve \\(y=y(x)\\) at \\(y=2\\) and the line \\(x=2\\) intersects the curve \\(y=y(x)\\) at \\(y=\\alpha\\), then a value of \\(\\alpha\\) is",
    "options": [
      "\\(\\frac{1-3e^{2}}{2(3e^{2}+1)}\\)",
      "\\(\\frac{1+3e^{2}}{2(3e^{2}-1)}\\)",
      "\\(\\frac{3e^{2}}{2(3e^{2}-1)}\\)",
      "\\(\\frac{3e^{2}}{2(3e^{2}+1)}\\)"
    ],
    "answer": "\\(\\frac{1+3e^{2}}{2(3e^{2}-1)}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 76,
    "content": "For any vector \\(\\vec{a}=a_{1}\\hat{i}+a_{2}\\hat{j}+a_{3}\\hat{k}\\), with \\(10|a_{i}| < 1, i=1,2,3\\), consider the following statements:\n(A): \\(\\max\\{|a_{1}|,|a_{2}|,|a_{3}|\\} \\le |\\vec{a}|\\)\n(B): \\(|\\vec{a}| \\le 3\\max\\{|a_{1}|,|a_{2}|,|a_{3}|\\}\\)",
    "options": [
      "Only B is true",
      "Only A is true",
      "Both A and B are true",
      "Neither A nor B is true"
    ],
    "answer": "Both A and B are true"
  },
  {
    "section": "Mathematics",
    "question_number": 77,
    "content": "Let \\(\\vec{a}\\) be a non-zero vector parallel to the line of intersection of the two planes described by \\(\\hat{i}+\\hat{j}\\), \\(\\hat{i}+\\hat{k}\\) and \\(\\hat{i}-\\hat{j}\\), \\(\\hat{j}-\\hat{k}\\). If \\(\\theta\\) is the angle between the vector \\(\\vec{a}\\) and the vector \\(\\vec{b}=2\\hat{i}-2\\hat{j}+\\hat{k}\\) and \\(\\vec{a} \\cdot \\vec{b}=6\\) then the ordered pair \\((\\theta, |\\vec{a} \\times \\vec{b}|)\\) is equal to",
    "options": [
      "\\((\\frac{\\pi}{3}, 3\\sqrt{6})\\)",
      "\\((\\frac{\\pi}{4}, 3\\sqrt{6})\\)",
      "\\((\\frac{\\pi}{3}, 6)\\)",
      "\\((\\frac{\\pi}{4}, 6)\\)"
    ],
    "answer": "\\((\\frac{\\pi}{4}, 6)\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 78,
    "content": "Let \\((\\alpha,\\beta,\\gamma)\\) be the image of point \\(P(2,3,5)\\) in the plane \\(2x+y-3z=6\\). Then \\(\\alpha+\\beta+\\gamma\\) is equal to",
    "options": [
      "5",
      "10",
      "12",
      "9"
    ],
    "answer": "10"
  },
  {
    "section": "Mathematics",
    "question_number": 79,
    "content": "If the equation of the plane that contains the point \\((-2,3,5)\\) and is perpendicular to each of the planes \\(2x+4y+5z=8\\) and \\(3x-2y+3z=5\\) is \\(\\alpha x+\\beta y+\\gamma z+97=0\\) then \\(\\alpha+\\beta+\\gamma=\\)",
    "options": [
      "15",
      "18",
      "16",
      "17"
    ],
    "answer": "15"
  },
  {
    "section": "Mathematics",
    "question_number": 80,
    "content": "Let \\(S=\\{M=[a_{ij}], a_{ij} \\in \\{0,1,2\\}, 1 \\le i, j \\le 2\\}\\) be a sample space and \\(A=\\{M \\in S: M \\text{ is invertible}\\}\\) be an event. Then P(A) is equal to",
    "options": [
      "\\(16/27\\)",
      "\\(50/81\\)",
      "\\(49/81\\)",
      "\\(47/81\\)"
    ],
    "answer": "\\(47/81\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 81,
    "content": "If a and b are the roots of the equation \\(x^{2}-7x-1=0\\), then the value of \\(\\frac{a^{21}+b^{21}+a^{17}+b^{17}}{a^{19}+b^{19}}\\) is equal to __",
    "options": [],
    "answer": "51"
  },
  {
    "section": "Mathematics",
    "question_number": 82,
    "content": "In an examination, 5 students have been allotted their seats as per their roll numbers. The number of ways, in which none of the students sits on the allotted seat, is __",
    "options": [],
    "answer": "44"
  },
  {
    "section": "Mathematics",
    "question_number": 83,
    "content": "Let \\(S=109+\\frac{108}{5}+\\frac{107}{5^{2}}+....+\\frac{2}{5^{107}}+\\frac{1}{5^{108}}\\). Then the value of \\(16S-(25)^{-54}\\) is equal to __",
    "options": [],
    "answer": "2175"
  },
  {
    "section": "Mathematics",
    "question_number": 84,
    "content": "The number of integral terms in the expansion of \\((3^{1/2}+5^{1/4})^{680}\\) is equal to __",
    "options": [],
    "answer": "171"
  },
  {
    "section": "Mathematics",
    "question_number": 85,
    "content": "The mean of the coefficients of \\(x,x^{2},......,x^{7}\\) in the binomial expression of \\((2+x)^{9}\\) is __",
    "options": [],
    "answer": "2736"
  },
  {
    "section": "Mathematics",
    "question_number": 86,
    "content": "Let \\(H_{n}:\\frac{x^{2}}{1+n}-\\frac{y^{2}}{3+n}=1\\), \\(n \\in \\mathbb{N}\\). Let k be the smallest even value of n such that the eccentricity of \\(H_{k}\\) is a rational number. If \\(l\\) is the length of the latus rectum of \\(H_{k}\\), then 21l is equal to __",
    "options": [],
    "answer": "306"
  },
  {
    "section": "Mathematics",
    "question_number": 87,
    "content": "The number of ordered triplets of the truth values of p, q and r such that the truth value of the statement \\((p \\vee q) \\wedge (p \\vee r) \\Rightarrow (q \\vee r)\\) is True, is equal to __",
    "options": [],
    "answer": "7"
  },
  {
    "section": "Mathematics",
    "question_number": 88,
    "content": "Let \\(A=\\begin{bmatrix} 0 & 1 & 2 \\\\ a & 0 & 3 \\\\ 1 & c & 0 \\end{bmatrix}\\) where a, \\(c \\in R\\). If \\(A^{3}=A\\) and the positive value of a belongs to the interval \\((n-1, n]\\), where \\(n \\in \\mathbb{N}\\), then n is equal to __",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 89,
    "content": "For m, \\(n > 0\\), let \\(I_{m, n}=\\int_{0}^{1} t^{m}(1+3t)^{n}dt\\). If \\(11I_{10, 6} + 18I_{11, 5} = p(14)^{6}\\), then p is equal to __",
    "options": [],
    "answer": "32"
  },
  {
    "section": "Mathematics",
    "question_number": 90,
    "content": "Let a line L pass through the origin and be perpendicular to the lines \\(L_{1}:\\vec{r}=\\hat{i}-11\\hat{j}-7\\hat{k}+\\lambda(\\hat{i}+2\\hat{j}+3\\hat{k}), \\lambda \\in \\mathbb{R}\\) and \\(L_{2}:\\vec{r}=-\\hat{i}+\\hat{k}+\\mu(2\\hat{i}+2\\hat{j}+\\hat{k}), \\mu \\in \\mathbb{R}\\). If P is the point of intersection of L and \\(L_{1}\\) and \\(Q(\\alpha, \\beta, \\gamma)\\) is the foot of perpendicular from P on \\(L_{2}\\), then \\(9(\\alpha+\\beta+\\gamma)\\) is equal to __",
    "options": [],
    "answer": "5"
  }
],

10:[[
  {
    "section": "Physics",
    "question_number": 1,
    "content": "Given below are two statements:\nStatement I: Astronomical unit (Au), Parsec (Pc) and Light year (ly) are units for measuring astronomical distances.\nStatement II: \\( Au < Parsec (Pc) < ly \\)\nIn the light of the above statements, choose the most appropriate answer from the options given below:",
    "options": [
      "Both Statements I and Statements II are incorrect",
      "Statements I is correct but Statements II is incorrect",
      "Both Statements I and Statements II are correct",
      "Statements I is incorrect but Statements II is correct"
    ],
    "answer": "Statements I is correct but Statements II is incorrect"
  },
  {
    "section": "Physics",
    "question_number": 2,
    "content": "From the v-t graph shown, the ratio of distance to displacement in 25 s of motion is:<br><img src='images/9/q2.png' alt='Question 2'>",
    "options": [
      "1",
      "3/5",
      "5/3",
      "1/2"
    ],
    "answer": "5/3"
  },
  {
    "section": "Physics",
    "question_number": 3,
    "content": "A coin placed on a rotating table just slips when it is placed at a distance of 1 cm from the centre. If the angular velocity of the table is halved, it will just slip when placed at a distance of:",
    "options": [
      "8 cm",
      "4 cm",
      "1 cm",
      "2 cm"
    ],
    "answer": "4 cm"
  },
  {
    "section": "Physics",
    "question_number": 4,
    "content": "An average force of 125 N is applied on a machine gun firing bullets each of mass 10 g at the speed of 250 m \\(s^{-1}\\) to keep it in position. The number of bullets fired per second by the machine gun is:",
    "options": [
      "50",
      "25",
      "100",
      "5"
    ],
    "answer": "50"
  },
  {
    "section": "Physics",
    "question_number": 5,
    "content": "The radii of two planets A and B are R and 4R and their densities are \\(\\rho\\) and \\(\\rho/3\\) respectively. The ratio of acceleration due to gravity at their surfaces \\(g_{A} : g_{B}\\) will be",
    "options": [
      "4:3",
      "1:16",
      "3:16",
      "3:4"
    ],
    "answer": "3:4"
  },
  {
    "section": "Physics",
    "question_number": 6,
    "content": "1 kg of water at \\(100^{\\circ}C\\) is converted into steam at \\(100^{\\circ}C\\) by boiling at atmospheric pressure. The volume of water changes from \\(1.00 \\times 10^{-3} m^{3}\\) as a liquid to \\(1.671 m^{3}\\) as steam. The change in internal energy of the system during the process will be (Given latent heat of vaporisation = 2257 kJ/kg, Atmospheric pressure = \\(1 \\times 10^{5}\\) Pa)",
    "options": [
      "-2426 kJ",
      "+2090 kJ",
      "-2090 kJ",
      "+2476 kJ"
    ],
    "answer": "+2090 kJ"
  },
  {
    "section": "Physics",
    "question_number": 7,
    "content": "On a temperature scale 'X', the boiling point of water is \\(65^{\\circ}X\\) and the freezing point is \\(-15^{\\circ}X\\) Assuming that the X scale is linear. The equivalent temperature corresponding to \\(-95^{\\circ}X\\) on the Fahrenheit scale would be",
    "options": [
      "-112^{\\circ}F",
      "-48^{\\circ}F",
      "-148^{\\circ}F",
      "-63^{\\circ}F"
    ],
    "answer": "-148^{\\circ}F"
  },
  {
    "section": "Physics",
    "question_number": 8,
    "content": "Three vessels of equal volume contain gases at the same temperature and pressure. The first vessel contains neon (monoatomic), the second contains chlorine (diatomic) and third contains uranium hexafluoride (polyatomic). Arrange these on the basis of their root mean square speed \\(v_{rms}\\) and choose the correct answer from the options given below:",
    "options": [
      "\\(v_{rms}(mono) > v_{rms}(dia) > v_{rms}(poly)\\)",
      "\\(v_{rms}(mono) = v_{rms}(dia) = v_{rms}(poly)\\)",
      "\\(v_{rms}(mono) < v_{rms}(dia) < v_{rms}(poly)\\)",
      "\\(v_{rms}(dia) < v_{rms}(poly) < v_{rms}(mono)\\)"
    ],
    "answer": "\\(v_{rms}(mono) > v_{rms}(dia) > v_{rms}(poly)\\)"
  },
  {
    "section": "Physics",
    "question_number": 9,
    "content": "The variation of kinetic energy (KE) of a particle executing simple harmonic motion with the displacement (x) starting from mean position to extreme position (A) is given by<br><img src='images/9/q9.png' alt='Question 9'>",
    "options": [
      "Graph 1",
      "Graph 2",
      "Graph 3",
      "Graph 4"
    ],
    "answer": "Graph 3"
  },
  {
    "section": "Physics",
    "question_number": 10,
    "content": "The electric field in an electromagnetic wave is given as \\(\\vec{E}=20 \\sin(\\omega t-\\frac{x}{c})\\vec{j}N C^{-1}\\), where \\(\\omega\\) and c are angular frequency and velocity of electromagnetic wave respectively. The energy contained in a volume of \\(5 \\times 10^{-4}m^{3}\\) will be (Given \\(\\epsilon_{0}=8.85 \\times 10^{-12}C^{2}N^{-1}m^{-2})\\)",
    "options": [
      "\\(88.5 \\times 10^{-13}\\) J",
      "\\(17.7 \\times 10^{-13}\\) J",
      "\\(28.5 \\times 10^{-13}\\) J",
      "\\(8.85 \\times 10^{-13}\\) J"
    ],
    "answer": "\\(8.85 \\times 10^{-13}\\) J"
  },
  {
    "section": "Physics",
    "question_number": 11,
    "content": "A parallel plate capacitor of capacitance 2 F is charged to a potential V. The energy stored in the capacitor is \\(E_{1}\\). The capacitor is now connected to another uncharged identical capacitor in parallel combination. The energy stored in the combination is \\(E_{2}\\). The ratio \\(E_{2}/E_{1}\\) is",
    "options": [
      "2:1",
      "2:3",
      "1:2",
      "1:4"
    ],
    "answer": "1:2"
  },
  {
    "section": "Physics",
    "question_number": 12,
    "content": "Two identical heater filaments are connected first in parallel and then in series. At the same applied voltage, the ratio of heat produced in same time for parallel to series will be:",
    "options": [
      "1:4",
      "2:1",
      "4:1",
      "1:2"
    ],
    "answer": "4:1"
  },
  {
    "section": "Physics",
    "question_number": 13,
    "content": "The current sensitivity of moving coil galvanometer is increased by 25%. This increase is achieved only by changing in the number of turns of coils and area of cross section of the wire while keeping the resistance of galvanometer coil constant. The percentage change in the voltage sensitivity will be:",
    "options": [
      "+25%",
      "-50%",
      "-25%",
      "Zero"
    ],
    "answer": "+25%"
  },
  {
    "section": "Physics",
    "question_number": 14,
    "content": "The free space inside a current carrying toroid is filled with a material of susceptibility \\(2 \\times 10^{-2}\\). The percentage increase in the value of magnetic field inside the toroid will be",
    "options": [
      "0.2%",
      "0.1%",
      "2%",
      "1%"
    ],
    "answer": "2%"
  },
  {
    "section": "Physics",
    "question_number": 15,
    "content": "As per the given graph, choose the correct representation for curve A and curve B. {Where \\(X_{c}=\\) Reactance of pure capacitive circuit connected with A.C. source, \\(X_{L}=\\) Reactance of pure inductive circuit connected with A.C. source, \\(R=\\) Impedance of pure resistive circuit connected with A.C. source, \\(Z=\\) Impedance of the LCR series circuit }<br><img src='images/9/q15.png' alt='Question 15'>",
    "options": [
      "\\(A=X_{C}, B=R\\)",
      "\\(A=X_{L}, B=R\\)",
      "\\(A=X_{L}, B=Z\\)",
      "\\(A=X_{C}, B=X_{L}\\)"
    ],
    "answer": "\\(A=X_{C}, B=X_{L}\\)"
  },
  {
    "section": "Physics",
    "question_number": 16,
    "content": "The critical angle for a denser-rarer interface is \\(45^{\\circ}\\). The speed of light in rarer medium is \\(3 \\times 10^{8}\\) m \\(s^{-1}\\). The speed of light in the denser medium is:",
    "options": [
      "\\(3.12 \\times 10^{7}\\) m \\(s^{-1}\\)",
      "\\(5 \\times 10^{7}\\) m \\(s^{-1}\\)",
      "\\(2.12 \\times 10^{8}\\) m \\(s^{-1}\\)",
      "\\(\\sqrt{2} \\times 10^{8}\\) m \\(s^{-1}\\)"
    ],
    "answer": "\\(2.12 \\times 10^{8}\\) m \\(s^{-1}\\)"
  },
  {
    "section": "Physics",
    "question_number": 17,
    "content": "A metallic surface is illuminated with radiation of wavelength \\(\\lambda\\), the stopping potential is \\(V_{0}\\). If the same surface is illuminated with radiation of wavelength \\(2\\lambda\\), the stopping potential becomes \\(V_{0}/4\\). The threshold wavelength for this metallic surface will be",
    "options": [
      "3\\(\\lambda\\)",
      "4\\(\\lambda\\)",
      "\\(\\frac{3}{2}\\lambda\\)",
      "\\(\\frac{\\lambda}{4}\\)"
    ],
    "answer": "3\\(\\lambda\\)"
  },
  {
    "section": "Physics",
    "question_number": 18,
    "content": "Two radioactive elements A and B initially have same number of atoms. The half life of A is same as the average life of B. If \\(\\lambda_{A}\\) and \\(\\lambda_{B}\\) are decay constants of A and B respectively, then choose the correct relation from the given options.",
    "options": [
      "\\(\\lambda_{A} \\ln 2 = \\lambda_{B}\\)",
      "\\(\\lambda_{A} = \\lambda_{B}\\)",
      "\\(\\lambda_{A} = \\lambda_{B} \\ln 2\\)",
      "\\(\\lambda_{A} = 2\\lambda_{B}\\)"
    ],
    "answer": "\\(\\lambda_{A} = \\lambda_{B} \\ln 2\\)"
  },
  {
    "section": "Physics",
    "question_number": 19,
    "content": "The logic performed by the circuit shown in figure is equivalent to<br><img src='images/9/q19.png' alt='Question 19'>",
    "options": [
      "AND",
      "NOR",
      "OR",
      "NAND"
    ],
    "answer": "AND"
  },
  {
    "section": "Physics",
    "question_number": 20,
    "content": "A transmitting antenna is kept on the surface of the earth. The minimum height of receiving antenna required to receive the signal in line of sight at 4 km distance from it is \\(x \\times 10^{-2}\\) m. The value of x is (Let, radius of earth \\(R=6400\\) km)",
    "options": [
      "125",
      "1250",
      "12.5",
      "1.25"
    ],
    "answer": "125"
  },
  {
    "section": "Physics",
    "question_number": 21,
    "content": "A projectile fired at 30° to the ground is observed to be at same height at time 3 s and 5 s after projection, during its flight. The speed of projection of the projectile is __ m \\(s^{-1}\\). (Given \\(g=10 m s^{-2}\\))",
    "options": [],
    "answer": "80"
  },
  {
    "section": "Physics",
    "question_number": 22,
    "content": "A force \\(\\vec{F}=2+3x\\hat{i}\\) acts on a particle in the x direction where F is in Newton and x is in meter. The work done by this force during a displacement from \\(x=0\\) to \\(x=4\\) m is __ J.",
    "options": [],
    "answer": "32"
  },
  {
    "section": "Physics",
    "question_number": 23,
    "content": "A solid sphere of mass 500 g radius 5 cm is rotated about one of its diameter with angular speed of 10 rad \\(s^{-1}\\). If the moment of inertia of the sphere about its tangent is \\(x \\times 10^{-2}\\) times its angular momentum about the diameter. Then the value of x will be __",
    "options": [],
    "answer": "35"
  },
  {
    "section": "Physics",
    "question_number": 24,
    "content": "The length of a wire becomes \\(l_{1}\\) and \\(l_{2}\\) when 100 N and 120 N tension are applied respectively. If \\(10l_{2}=11l_{1}\\), then the natural length of wire will be \\(\\frac{1}{x}l_{1}\\). Here the value of x is __",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Physics",
    "question_number": 25,
    "content": "The equation of wave is given by \\(Y=10^{-2} \\sin 2\\pi(160t-0.5x+\\frac{\\pi}{4})\\) where x and Y are in m and t in s. The speed of the wave is __ km \\(h^{-1}\\).",
    "options": [],
    "answer": "1152"
  },
  {
    "section": "Physics",
    "question_number": 26,
    "content": "As shown in the figure, a configuration of two equal point charges \\(q_{0}=+2\\mu C\\) is placed on an inclined plane. Mass of each point charge is 20 g. Assume that there is no friction between charge and plane. For the system of two point charges to be in equilibrium (at rest) the height \\(h=x \\times 10^{-3}\\) m. The value of x is __. (Take \\(\\frac{1}{4\\pi\\epsilon_{0}}=9 \\times 10^{9}\\) N \\(m^{2} C^{-2}\\), \\(g=10\\) m \\(s^{-2}\\))<br><img src='images/9/q26.png' alt='Question 26'>",
    "options": [],
    "answer": "300"
  },
  {
    "section": "Physics",
    "question_number": 27,
    "content": "In the circuit diagram shown in figure given below, the current flowing through resistance 3\\(\\Omega\\) is \\(\\frac{x}{3}\\) A. The value of x is __<br><img src='images/9/q27.png' alt='Question 27'>",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Physics",
    "question_number": 28,
    "content": "The magnetic field B crossing normally a square metallic plate of area 4 \\(m^{2}\\) is changing with time as shown in figure. The magnitude of induced emf in the plate during \\(t=2\\) s to \\(t=4\\) s, is __ mV.<br><img src='images/9/q28.png' alt='Question 28'>",
    "options": [],
    "answer": "8"
  },
  {
    "section": "Physics",
    "question_number": 29,
    "content": "The radius of curvature of each surface of a convex lens having refractive index 1.8 is 20 cm. The lens is now immersed in a liquid of refractive index 1.5. The ratio of power of lens in air to its power in the liquid will be x: 1. The value of x is __",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Physics",
    "question_number": 30,
    "content": "A monochromatic light is incident on a hydrogen sample in ground state. Hydrogen atoms absorb a fraction of light and subsequently emit radiation of six different wavelengths. The frequency of incident light is \\(x \\times 10^{15}\\) Hz. The value of x is __. (Given \\(h=4.25 \\times 10^{-15}\\) eVs)",
    "options": [],
    "answer": "3"
  },
  {
    "section": "Chemistry",
    "question_number": 31,
    "content": "25 mL of silver nitrate solution (1M) is added dropwise to 25 mL of potassium iodide (1.05 M) solution. The ion(s) present in very small quantity in the solution is/are",
    "options": [
      "I only",
      "\\(K^{+}\\) only",
      "\\(NO_{3}^{-}\\)",
      "\\(Ag^{+}\\) and I both"
    ],
    "answer": "\\(Ag^{+}\\) and I both"
  },
  {
    "section": "Chemistry",
    "question_number": 32,
    "content": "Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:\nAssertion A: In the photoelectric effect, the electrons are ejected from the metal surface as soon as the beam of light of frequency greater than threshold frequency strikes the surface.\nReason R: When the photon of any energy strikes an electron in the atom, transfer of energy from the photon to the electron takes place.\nIn the light of the above statements, choose the most appropriate answer from the options given below :",
    "options": [
      "Both A and R are correct and R is the correct explanation of A",
      "A is correct but R is not correct",
      "Both A and R are correct but R is NOT the correct explanation of A",
      "A is not correct but R is correct"
    ],
    "answer": "A is correct but R is not correct"
  },
  {
    "section": "Chemistry",
    "question_number": 33,
    "content": "For compound having the formula \\(GaAlCl_{4}\\), the correct option from the following is",
    "options": [
      "Ga is coordinated with Cl in \\(GaAlCl_{4}\\)",
      "Ga is more electronegative than Al and is present as a cationic part of the salt \\(GaAlCl_{4}\\)",
      "Cl forms bond with both Al and Ga in \\(GaAlCl_{4}\\)",
      "Oxidation state of Ga in the salt \\(GaAlCl_{4}\\) is +3"
    ],
    "answer": "Ga is more electronegative than Al and is present as a cationic part of the salt \\(GaAlCl_{4}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 34,
    "content": "For elements B, C, N, Li, Be, O and F, the correct order of first ionisation enthalpy is",
    "options": [
      "\\(Li < Be < B < C < O < N < F\\)",
      "\\(B < Li < Be < C < N < O < F\\)",
      "\\(Li < Be < B < C < N < O < F\\)",
      "\\(Li < B < Be < C < O < N < F\\)"
    ],
    "answer": "\\(Li < B < Be < C < O < N < F\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 35,
    "content": "Match List-I with List-II:\nList-I (Species): A. \\(H_{3}O^{+}\\) B. Acetylide anion C. \\(NH_{4}^{+}\\) D. \\(ClO_{2}^{-}\\)\nList-II (Geometry/Shape): I. Tetrahedral II. Linear III. Pyramidal IV. Bent\nChoose the correct answer from the options given below:",
    "options": [
      "A(III), B(IV), C(I), D(II)",
      "A(III), B(I), C(II), D(IV)",
      "A(III), B(II), C(I), D(IV)",
      "A(III), B(IV), C(II), D(I)"
    ],
    "answer": "A(III), B(II), C(I), D(IV)"
  },
  {
    "section": "Chemistry",
    "question_number": 36,
    "content": "Match List-I with List-II:\nList-I: A. K B. KCl C. KOH D. Li\nList-II: I. Thermonuclear reactions II. Fertilizer III. Sodium potassium pump IV. Absorbent of \\(CO_{2}\\)",
    "options": [
      "A(III), B(II), C(IV), D(I)",
      "A(III), B(IV), C(II), D(I)",
      "A(IV), B(I), C(III), D(II)",
      "A(IV), B(III), C(I), D(II)"
    ],
    "answer": "A(III), B(II), C(IV), D(I)"
  },
  {
    "section": "Chemistry",
    "question_number": 37,
    "content": "Find out the correct statement from the options given below for the reactions shown in the figure.<br><img src='images/9/q37.png' alt='Question 37'>",
    "options": [
      "Reaction (i) is of \\(2^{nd}\\) order and reaction (ii) is of \\(1^{st}\\) order",
      "Reactions (i) and (ii) both are of \\(2^{nd}\\) order",
      "Reactions (i) is of \\(1^{st}\\) order and reaction (ii) is of \\(2^{nd}\\) order",
      "Reaction (i) and (ii) both are of \\(1^{st}\\) order"
    ],
    "answer": "Reactions (i) is of \\(1^{st}\\) order and reaction (ii) is of \\(2^{nd}\\) order"
  },
  {
    "section": "Chemistry",
    "question_number": 38,
    "content": "Thin layer chromatography of a mixture shows the following observation: The correct order of elution in the silica gel column chromatography is<br><img src='images/9/q38.png' alt='Question 38'>",
    "options": [
      "B, A, C",
      "B, C, A",
      "A, C, B",
      "C, A, B"
    ],
    "answer": "A, C, B"
  },
  {
    "section": "Chemistry",
    "question_number": 39,
    "content": "Arrange the following compounds in increasing order of rate of aromatic electrophilic substitution reaction.<br><img src='images/9/q39.png' alt='Question 39'>",
    "options": [
      "d, b, c, a",
      "d, b, a, c",
      "b, c, a, d",
      "c, a, b, d"
    ],
    "answer": "c, a, b, d"
  },
  {
    "section": "Chemistry",
    "question_number": 40,
    "content": "Given below are two statements:\nStatement-I: If BOD is 4 ppm and dissolved oxygen is 8 ppm, then it is a good quality water.\nStatement-II: If the concentration of zinc and nitrate salts are 5 ppm each, then it can be a good quality water.\nIn the light of the above statements, choose the most appropriate answer from the options given below :",
    "options": [
      "Statement I is correct but Statement II is incorrect",
      "Statement I is incorrect but Statement II is correct",
      "Both the statements I and II are incorrect",
      "Both the statements I and II are correct"
    ],
    "answer": "Both the statements I and II are correct"
  },
  {
    "section": "Chemistry",
    "question_number": 41,
    "content": "In the extraction process of copper, the product obtained after carrying out the reactions\n(i) \\(2Cu_{2}S + 3O_{2} \\rightarrow 2Cu_{2}O + 2SO_{2}\\)\n(ii) \\(2Cu_{2}O + Cu_{2}S \\rightarrow 6Cu + SO_{2}\\)\nis called",
    "options": [
      "Blister copper",
      "Reduced copper",
      "Copper scrap",
      "Copper matte"
    ],
    "answer": "Blister copper"
  },
  {
    "section": "Chemistry",
    "question_number": 42,
    "content": "Given below are two statements:\nStatement-I: Methane and steam passed over a heated Ni catalyst produces hydrogen gas.\nStatement-II: Sodium nitrite reacts with \\(NH_{4}Cl\\) to give \\(H_{2}O\\), \\(N_{2}\\) and NaCl.\nIn the light of the above statements, choose the most appropriate answer from the options given below :",
    "options": [
      "Statement I is incorrect but Statement II is correct",
      "Both the statements I and II are incorrect",
      "Statement I is correct but Statement II is incorrect",
      "Both the statements I and II are correct"
    ],
    "answer": "Both the statements I and II are correct"
  },
  {
    "section": "Chemistry",
    "question_number": 43,
    "content": "When a solution of mixture having two inorganic salts was treated with freshly prepared ferrous sulphate in acidic medium, a dark brown ring was formed whereas on treatment with neutral \\(FeCl_{3}\\) it gave deep red colour which disappeared on boiling and a brown red ppt was formed. The mixture contains",
    "options": [
      "\\(SO_{3}^{2-} \\& CH_{3}COO^{-}\\)",
      "\\(CH_{3}COO^{-} \\& NO_{3}^{-}\\)",
      "\\(SO_{3}^{2-} \\& C_{2}O_{4}^{2-}\\)",
      "\\(C_{2}O_{4}^{2-} \\& NO_{3}^{-}\\)"
    ],
    "answer": "\\(CH_{3}COO^{-} \\& NO_{3}^{-}\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 44,
    "content": "The complex that dissolves in water is",
    "options": [
      "\\((NH_{4})_{3}[As(Mo_{3}O_{10})_{4}]\\)",
      "\\(Fe_{4}[Fe(CN)_{6}]_{3}\\)",
      "\\(K_{3}[Co(NO_{2})_{6}]\\)",
      "\\([Fe_{3}(OH)_{2}(OAc)_{6}]Cl\\)"
    ],
    "answer": "\\([Fe_{3}(OH)_{2}(OAc)_{6}]Cl\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 45,
    "content": "The set which does not have ambidentate ligand(s) is",
    "options": [
      "\\(C_{2}O_{4}^{2-}\\), ethylene diamine, \\(H_{2}O\\)",
      "\\(EDTA^{4-}\\), NCS, \\(C_{2}O_{4}^{2-}\\)",
      "\\(NO_{2}^{-}\\), \\(C_{2}O_{4}^{2-}\\), \\(EDTA^{4-}\\)",
      "\\(C_{2}O_{4}^{2-}\\), \\(NO_{2}^{-}\\), NCS"
    ],
    "answer": "\\(C_{2}O_{4}^{2-}\\), ethylene diamine, \\(H_{2}O\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 46,
    "content": "Which of the following complex has a possibility to exist as meridional isomer?",
    "options": [
      "\\([Co(NH_{3})_{3}(NO_{2})_{3}]\\)",
      "\\([Pt(NH_{3})_{2}Cl_{2}]\\)",
      "\\([Co(en)_{2}Cl_{2}]\\)",
      "\\([Co(en)_{3}]\\)"
    ],
    "answer": "\\([Co(NH_{3})_{3}(NO_{2})_{3}]\\)"
  },
  {
    "section": "Chemistry",
    "question_number": 47,
    "content": "L-isomer of tetrose X \\((C_{4}H_{8}O_{4})\\) gives positive Schiff's test and has two chiral carbons. On acetylation 'X' yields triacetate. 'X' also undergoes following reactions. 'A' and 'B' are:<br><img src='images/9/q47.png' alt='Question 47'>",
    "options": [
      "Structure 1",
      "Structure 2",
      "Structure 3",
      "Structure 4"
    ],
    "answer": "Structure 2"
  },
  {
    "section": "Chemistry",
    "question_number": 48,
    "content": "'A' and 'B' in the above reactions are:<br><img src='images/9/q48.png' alt='Question 48'>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  },
  {
    "section": "Chemistry",
    "question_number": 49,
    "content": "Identify the Major Product 'X'.<br><img src='images/9/q49.png' alt='Question 49'>",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 1"
  },
  {
    "section": "Chemistry",
    "question_number": 50,
    "content": "The polymer X consists of linear molecules and is closely packed. It is prepared in the presence of triethylaluminium and titanium tetrachloride under low pressure. The polymer X is",
    "options": [
      "High density polythene",
      "Polyacrylonitrile",
      "Low density polythene",
      "Polytetrafluoroethane"
    ],
    "answer": "High density polythene"
  },
  {
    "section": "Chemistry",
    "question_number": 51,
    "content": "A solution of sugar is obtained by mixing 200 g of its 25% solution and 500 g of its 40% solution (both by mass). The mass percentage of the resulting sugar solution is __ (Nearest integer)",
    "options": [],
    "answer": "36"
  },
  {
    "section": "Chemistry",
    "question_number": 52,
    "content": "Solid fuel used in rocket is a mixture of \\(Fe_{2}O_{3}\\) and Al (in ratio 1: 2). The heat evolved (kJ) per gram of the mixture is __ (Nearest integer)\nGiven \\(\\Delta H_{f}^{0}(Al_{2}O_{3}) = -1700\\) kJ \\(mol^{-1}\\), \\(\\Delta H_{f}^{0}(Fe_{2}O_{3}) = -840\\) kJ \\(mol^{-1}\\)\nMolar mass of Fe, Al and O are 56, 27 and 16 g \\(mol^{-1}\\) respectively",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 53,
    "content": "A mixture of one mole of \\(H_{2}O\\) and 1 mole of CO is taken in a 10 litre container and heated to 725 K. At equilibrium 40% of water by mass reacts with carbon monoxide according to the equation: \\(CO(g) + H_{2}O(g) \\rightleftharpoons CO_{2}(g) + H_{2}(g)\\). The equilibrium constant \\(K_{c} \\times 10^{2}\\) for the reaction is __ (Nearest integer)",
    "options": [],
    "answer": "44"
  },
  {
    "section": "Chemistry",
    "question_number": 54,
    "content": "The number of hyperconjugation structures involved to stabilize carbocation formed in the above reaction is __<br><img src='images/9/q54.png' alt='Question 54'>",
    "options": [],
    "answer": "7"
  },
  {
    "section": "Chemistry",
    "question_number": 55,
    "content": "An atomic substance A of molar mass 12 g \\(mol^{-1}\\) has a cubic crystal structure with edge length of 300 pm. The no. of atoms present in one unit cell of A is __ (Nearest integer)\nGiven the density of A is 3.0 g \\(cm^{-3}\\) and \\(N_{A}=6.02 \\times 10^{23} mol^{-1}\\)",
    "options": [],
    "answer": "4"
  },
  {
    "section": "Chemistry",
    "question_number": 56,
    "content": "0.004 M \\(K_{2}SO_{4}\\) solution is isotonic with 0.01 M glucose solution. Percentage dissociation of \\(K_{2}SO_{4}\\) is __ (Nearest integer)",
    "options": [],
    "answer": "75"
  },
  {
    "section": "Chemistry",
    "question_number": 57,
    "content": "In an electrochemical reaction of lead, at standard temperature, if \\(E_{(Pb^{2+}/Pb)}^{0} = m\\) Volt and \\(E_{(Pb^{4+}/Pb)}^{0} = n\\) Volt, then the value of \\(E_{(Pb^{2+}/Pb^{4+})}^{0}\\) is given by \\(m - xn\\). The value of x is __",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Chemistry",
    "question_number": 58,
    "content": "\\(KClO_{3} + 6FeSO_{4} + 3H_{2}SO_{4} \\rightarrow KCl + 3Fe_{2}(SO_{4})_{3} + 3H_{2}O\\)\nThe above reaction was studied at 300 K by monitoring the concentration of \\(FeSO_{4}\\) in which initial concentration was 10 M and after half an hour became 8.8 M. The rate of production of \\(Fe_{2}(SO_{4})_{3}\\) is \\(__ \\times 10^{-6}\\) mol \\(L^{-1} s^{-1}\\) (Nearest integer)",
    "options": [],
    "answer": "333"
  },
  {
    "section": "Chemistry",
    "question_number": 59,
    "content": "The ratio of spin-only magnetic moment values \\(\\mu_{eff}[Cr(CN)_{6}]^{3-} / \\mu_{eff}[Cr(H_{2}O)_{6}]^{3+}\\) is __",
    "options": [],
    "answer": "1"
  },
  {
    "section": "Chemistry",
    "question_number": 60,
    "content": "The ratio x/y on completion of the above reaction is __<br><img src='images/9/q60.png' alt='Question 60'>",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 61,
    "content": "The number of integral solutions x of \\(\\log_{(x+\\frac{7}{2})} (\\frac{x-7}{2x-3})^{2} \\ge 0\\) is",
    "options": [
      "7",
      "8",
      "6",
      "5"
    ],
    "answer": "6"
  },
  {
    "section": "Mathematics",
    "question_number": 62,
    "content": "Let \\(w_{1}\\) be the point obtained by the rotation of \\(z_{1}=5+4i\\) about the origin through a right angle in the anticlockwise direction, and \\(w_{2}\\) be the point obtained by the rotation of \\(z_{2}=3+5i\\) about the origin through a right angle in the clockwise direction. Then the principal argument of \\(w_{1}-w_{2}\\) is equal to",
    "options": [
      "\\(\\pi - \\tan^{-1}\\frac{8}{9}\\)",
      "\\(-\\pi + \\tan^{-1}\\frac{33}{5}\\)",
      "\\(-\\pi + \\tan^{-1}\\frac{8}{9}\\)",
      "\\(\\pi - \\tan^{-1}\\frac{33}{5}\\)"
    ],
    "answer": "\\(\\pi - \\tan^{-1}\\frac{8}{9}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 63,
    "content": "The number of triplets (x, y, z) where x, y, z are distinct non negative integers satisfying \\(x+y+z=15\\), is",
    "options": [
      "80",
      "136",
      "114",
      "92"
    ],
    "answer": "114"
  },
  {
    "section": "Mathematics",
    "question_number": 64,
    "content": "Let \\(x_{1},x_{2},...,x_{100}\\) be in an arithmetic progression, with \\(x_{1}=2\\) and their mean equal to 200. If \\(y_{i}=i(x_{i}-i), 1 \\le i \\le 100\\), then the mean of \\(y_{1},y_{2},...,y_{100}\\) is",
    "options": [
      "10100",
      "10101.50",
      "10049.50",
      "10051.50"
    ],
    "answer": "10049.50"
  },
  {
    "section": "Mathematics",
    "question_number": 65,
    "content": "The number of elements in the set \\(S=\\{\\theta \\in [0,2\\pi]: 3\\cos^{4}\\theta-5\\cos^{2}\\theta-2\\sin^{6}\\theta+2=0\\}\\) is",
    "options": [
      "10",
      "8",
      "12",
      "9"
    ],
    "answer": "9"
  },
  {
    "section": "Mathematics",
    "question_number": 66,
    "content": "Consider ellipses \\(E_{k}:kx^{2}+k^{2}y^{2}=1\\), \\(k=1,2,...,20\\). Let \\(C_{k}\\) be the circle which touches the four chords joining the end points (one on minor axis and another on major axis) of the ellipse \\(E_{k}\\). If \\(r_{k}\\) is the radius of the circle \\(C_{k}\\) then the value of \\(\\sum_{k=1}^{20} \\frac{1}{r_{k}^{2}}\\) is",
    "options": [
      "3080",
      "2870",
      "3210",
      "3320"
    ],
    "answer": "3080"
  },
  {
    "section": "Mathematics",
    "question_number": 67,
    "content": "Let R be a rectangle given by the lines \\(x=0\\), \\(x=2\\), \\(y=0\\) and \\(y=5\\). Let \\(A(\\alpha, 0)\\) and \\(B(0, \\beta)\\), \\(\\alpha \\in [0,2]\\) and \\(\\beta \\in [0,5]\\) be such that the line segment AB divides the area of the rectangle R in the ratio 4: 1. Then, the mid-point of AB lies on a",
    "options": [
      "straight line",
      "parabola",
      "hyperbola",
      "circle"
    ],
    "answer": "hyperbola"
  },
  {
    "section": "Mathematics",
    "question_number": 68,
    "content": "Let sets A and B have 5 elements each. Let the mean of the elements in sets A and B be 5 and 8 respectively and the variance of the elements in sets A and B be 12 and 20 respectively. A new set C of 10 elements is formed by subtracting 3 from each element of A and adding 2 to each element of B. Then the sum of the mean and variance of the elements of C is",
    "options": [
      "40",
      "32",
      "38",
      "36"
    ],
    "answer": "38"
  },
  {
    "section": "Mathematics",
    "question_number": 69,
    "content": "An organization awarded 48 medals in event 'A', 25 in event 'B' and 18 in event 'C'. If these medals went to total 60 men and only five men got medals in all the three events, then, how many received medals in exactly two of three events?",
    "options": [
      "15",
      "21",
      "10",
      "9"
    ],
    "answer": "21"
  },
  {
    "section": "Mathematics",
    "question_number": 70,
    "content": "Let A be a \\(2 \\times 2\\) matrix with real entries such that \\(A^{T}=\\alpha A+I\\), where \\(\\alpha \\in \\mathbb{R}-\\{-1,1\\}\\). If \\(\\det(A^{2}-A)=4\\), the sum of all possible values of \\(\\alpha\\) is equal to",
    "options": [
      "0",
      "2",
      "\\(5/2\\)",
      "\\(3/2\\)"
    ],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 71,
    "content": "Let \\(f(x)=[x^{2}-x]+|-x+[x]|\\), where \\(x \\in \\mathbb{R}\\) and [t] denotes the greatest integer less than or equal to t. Then, f is",
    "options": [
      "continuous at x=0, but not continuous at x=1",
      "continuous at x=1, but not continuous at x=0",
      "continuous at x=0 and x=1",
      "not continuous at x=0 and x=1"
    ],
    "answer": "continuous at x=1, but not continuous at x=0"
  },
  {
    "section": "Mathematics",
    "question_number": 72,
    "content": "Let \\(f:[2,4] \\rightarrow \\mathbb{R}\\) be a differentiable function such that \\((x \\log x) f'(x) + (\\log x) f(x) + f(x) \\ge 1\\), \\(x \\in [2,4]\\) with \\(f(2)=\\frac{1}{2}\\) and \\(f(4)=\\frac{1}{4}\\). Consider the following two statements:\n(A) \\(f(x) \\le 1\\) for all \\(x \\in [2,4]\\)\n(B) \\(f(x) \\ge 1/8\\) for all \\(x \\in [2,4]\\)\nThen,",
    "options": [
      "Neither statement (A) nor statement (B) is true",
      "Only statement (B) is true",
      "Both the statements (A) and (B) are true",
      "Only statement (A) is true"
    ],
    "answer": "Both the statements (A) and (B) are true"
  },
  {
    "section": "Mathematics",
    "question_number": 73,
    "content": "The value of the integral \\(\\int_{-\\log_{e}2}^{\\log_{e}2} e^{x}(\\log_{e}(e^{x}+\\sqrt{1+e^{2x}}))dx\\) is equal to",
    "options": [
      "\\(\\log_{e}(\\frac{(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)",
      "\\(\\log_{e}(\\frac{\\sqrt{2}(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)",
      "\\(\\log_{e}(\\frac{2(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})-\\frac{\\sqrt{5}}{2}\\)",
      "\\(\\log_{e}(\\frac{\\sqrt{2}(3-\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)"
    ],
    "answer": "\\(\\log_{e}(\\frac{(2+\\sqrt{5})^{2}}{\\sqrt{1+\\sqrt{5}}})+\\frac{\\sqrt{5}}{2}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 74,
    "content": "Area of the region \\(\\{(x, y): x^{2}+(y-2)^{2} \\le 4, x^{2} \\ge 2y\\}\\) is",
    "options": [
      "\\(\\pi + \\frac{8}{3}\\)",
      "\\(2\\pi + \\frac{16}{3}\\)",
      "\\(\\pi - \\frac{8}{3}\\)",
      "\\(2\\pi - \\frac{16}{3}\\)"
    ],
    "answer": "\\(2\\pi - \\frac{16}{3}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 75,
    "content": "Let \\(y=y(x)\\) be a solution curve of the differential equation, \\((1-x^{2}y^{2})dx=y dx+x dy\\). If the line \\(x=1\\) intersects the curve \\(y=y(x)\\) at \\(y=2\\) and the line \\(x=2\\) intersects the curve \\(y=y(x)\\) at \\(y=\\alpha\\), then a value of \\(\\alpha\\) is",
    "options": [
      "\\(\\frac{1-3e^{2}}{2(3e^{2}+1)}\\)",
      "\\(\\frac{1+3e^{2}}{2(3e^{2}-1)}\\)",
      "\\(\\frac{3e^{2}}{2(3e^{2}-1)}\\)",
      "\\(\\frac{3e^{2}}{2(3e^{2}+1)}\\)"
    ],
    "answer": "\\(\\frac{1+3e^{2}}{2(3e^{2}-1)}\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 76,
    "content": "For any vector \\(\\vec{a}=a_{1}\\hat{i}+a_{2}\\hat{j}+a_{3}\\hat{k}\\), with \\(10|a_{i}| < 1, i=1,2,3\\), consider the following statements:\n(A): \\(\\max\\{|a_{1}|,|a_{2}|,|a_{3}|\\} \\le |\\vec{a}|\\)\n(B): \\(|\\vec{a}| \\le 3\\max\\{|a_{1}|,|a_{2}|,|a_{3}|\\}\\)",
    "options": [
      "Only B is true",
      "Only A is true",
      "Both A and B are true",
      "Neither A nor B is true"
    ],
    "answer": "Both A and B are true"
  },
  {
    "section": "Mathematics",
    "question_number": 77,
    "content": "Let \\(\\vec{a}\\) be a non-zero vector parallel to the line of intersection of the two planes described by \\(\\hat{i}+\\hat{j}\\), \\(\\hat{i}+\\hat{k}\\) and \\(\\hat{i}-\\hat{j}\\), \\(\\hat{j}-\\hat{k}\\). If \\(\\theta\\) is the angle between the vector \\(\\vec{a}\\) and the vector \\(\\vec{b}=2\\hat{i}-2\\hat{j}+\\hat{k}\\) and \\(\\vec{a} \\cdot \\vec{b}=6\\) then the ordered pair \\((\\theta, |\\vec{a} \\times \\vec{b}|)\\) is equal to",
    "options": [
      "\\((\\frac{\\pi}{3}, 3\\sqrt{6})\\)",
      "\\((\\frac{\\pi}{4}, 3\\sqrt{6})\\)",
      "\\((\\frac{\\pi}{3}, 6)\\)",
      "\\((\\frac{\\pi}{4}, 6)\\)"
    ],
    "answer": "\\((\\frac{\\pi}{4}, 6)\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 78,
    "content": "Let \\((\\alpha,\\beta,\\gamma)\\) be the image of point \\(P(2,3,5)\\) in the plane \\(2x+y-3z=6\\). Then \\(\\alpha+\\beta+\\gamma\\) is equal to",
    "options": [
      "5",
      "10",
      "12",
      "9"
    ],
    "answer": "10"
  },
  {
    "section": "Mathematics",
    "question_number": 79,
    "content": "If the equation of the plane that contains the point \\((-2,3,5)\\) and is perpendicular to each of the planes \\(2x+4y+5z=8\\) and \\(3x-2y+3z=5\\) is \\(\\alpha x+\\beta y+\\gamma z+97=0\\) then \\(\\alpha+\\beta+\\gamma=\\)",
    "options": [
      "15",
      "18",
      "16",
      "17"
    ],
    "answer": "15"
  },
  {
    "section": "Mathematics",
    "question_number": 80,
    "content": "Let \\(S=\\{M=[a_{ij}], a_{ij} \\in \\{0,1,2\\}, 1 \\le i, j \\le 2\\}\\) be a sample space and \\(A=\\{M \\in S: M \\text{ is invertible}\\}\\) be an event. Then P(A) is equal to",
    "options": [
      "\\(16/27\\)",
      "\\(50/81\\)",
      "\\(49/81\\)",
      "\\(47/81\\)"
    ],
    "answer": "\\(47/81\\)"
  },
  {
    "section": "Mathematics",
    "question_number": 81,
    "content": "If a and b are the roots of the equation \\(x^{2}-7x-1=0\\), then the value of \\(\\frac{a^{21}+b^{21}+a^{17}+b^{17}}{a^{19}+b^{19}}\\) is equal to __",
    "options": [],
    "answer": "51"
  },
  {
    "section": "Mathematics",
    "question_number": 82,
    "content": "In an examination, 5 students have been allotted their seats as per their roll numbers. The number of ways, in which none of the students sits on the allotted seat, is __",
    "options": [],
    "answer": "44"
  },
  {
    "section": "Mathematics",
    "question_number": 83,
    "content": "Let \\(S=109+\\frac{108}{5}+\\frac{107}{5^{2}}+....+\\frac{2}{5^{107}}+\\frac{1}{5^{108}}\\). Then the value of \\(16S-(25)^{-54}\\) is equal to __",
    "options": [],
    "answer": "2175"
  },
  {
    "section": "Mathematics",
    "question_number": 84,
    "content": "The number of integral terms in the expansion of \\((3^{1/2}+5^{1/4})^{680}\\) is equal to __",
    "options": [],
    "answer": "171"
  },
  {
    "section": "Mathematics",
    "question_number": 85,
    "content": "The mean of the coefficients of \\(x,x^{2},......,x^{7}\\) in the binomial expression of \\((2+x)^{9}\\) is __",
    "options": [],
    "answer": "2736"
  },
  {
    "section": "Mathematics",
    "question_number": 86,
    "content": "Let \\(H_{n}:\\frac{x^{2}}{1+n}-\\frac{y^{2}}{3+n}=1\\), \\(n \\in \\mathbb{N}\\). Let k be the smallest even value of n such that the eccentricity of \\(H_{k}\\) is a rational number. If \\(l\\) is the length of the latus rectum of \\(H_{k}\\), then 21l is equal to __",
    "options": [],
    "answer": "306"
  },
  {
    "section": "Mathematics",
    "question_number": 87,
    "content": "The number of ordered triplets of the truth values of p, q and r such that the truth value of the statement \\((p \\vee q) \\wedge (p \\vee r) \\Rightarrow (q \\vee r)\\) is True, is equal to __",
    "options": [],
    "answer": "7"
  },
  {
    "section": "Mathematics",
    "question_number": 88,
    "content": "Let \\(A=\\begin{bmatrix} 0 & 1 & 2 \\\\ a & 0 & 3 \\\\ 1 & c & 0 \\end{bmatrix}\\) where a, \\(c \\in R\\). If \\(A^{3}=A\\) and the positive value of a belongs to the interval \\((n-1, n]\\), where \\(n \\in \\mathbb{N}\\), then n is equal to __",
    "options": [],
    "answer": "2"
  },
  {
    "section": "Mathematics",
    "question_number": 89,
    "content": "For m, \\(n > 0\\), let \\(I_{m, n}=\\int_{0}^{1} t^{m}(1+3t)^{n}dt\\). If \\(11I_{10, 6} + 18I_{11, 5} = p(14)^{6}\\), then p is equal to __",
    "options": [],
    "answer": "32"
  },
  {
    "section": "Mathematics",
    "question_number": 90,
    "content": "Let a line L pass through the origin and be perpendicular to the lines \\(L_{1}:\\vec{r}=\\hat{i}-11\\hat{j}-7\\hat{k}+\\lambda(\\hat{i}+2\\hat{j}+3\\hat{k}), \\lambda \\in \\mathbb{R}\\) and \\(L_{2}:\\vec{r}=-\\hat{i}+\\hat{k}+\\mu(2\\hat{i}+2\\hat{j}+\\hat{k}), \\mu \\in \\mathbb{R}\\). If P is the point of intersection of L and \\(L_{1}\\) and \\(Q(\\alpha, \\beta, \\gamma)\\) is the foot of perpendicular from P on \\(L_{2}\\), then \\(9(\\alpha+\\beta+\\gamma)\\) is equal to __",
    "options": [],
    "answer": "5"
  }
]],

    };

    // 3. GENERATOR ENGINE
    const TOPIC_BANKS = {
        Physics: ["Kinematics", "Newton's Laws", "Energy", "Rotation", "Gravitation", "Thermodynamics", "SHM", "Waves", "Electrostatics", "Current", "Magnetism", "Optics", "Modern Physics"],
        Chemistry: ["Atomic Structure", "Bonding", "Thermodynamics", "Equilibrium", "Solutions", "Kinetics", "Electrochemistry", "Inorganic", "Organic GOC", "Hydrocarbons", "Aldehydes"],
        Mathematics: ["Functions", "Limits", "Calculus", "Vectors", "3D Geometry", "Probability", "Complex Numbers", "Matrices", "Conics"]
    };

    function processHardcodedPaper(flatQuestions, paperId) {
        const subjects = { 'Physics': [], 'Chemistry': [], 'Mathematics': [] };
        (flatQuestions || []).forEach((q, idx) => {
            if (!q) return;
            const isMCQ = q.options && q.options.length > 0;
            let hash = q.answerHash;
            if (!hash && q.answer !== undefined && q.answer !== null) {
                hash = obfuscate(String(q.answer));
            }

            // Normalize subject name
            let rawSec = String(q.section || q.subject || (idx < 30 ? 'Physics' : idx < 60 ? 'Chemistry' : 'Mathematics'));
            let targetSubj = 'Physics';
            if (/chem/i.test(rawSec)) targetSubj = 'Chemistry';
            else if (/math/i.test(rawSec)) targetSubj = 'Mathematics';
            else if (/phy/i.test(rawSec)) targetSubj = 'Physics';

            const formattedQ = {
                id: `${targetSubj.substring(0,3).toLowerCase()}_p${paperId}_q${idx+1}`,
                type: isMCQ ? 'MCQ' : 'NUMERICAL',
                section: isMCQ ? 'Section A' : 'Section B',
                content: q.content || '',
                options: q.options || [],
                answerHash: hash,
                timeLimitSec: q.timeLimitSec || (targetSubj === 'Physics' ? 120 : targetSubj === 'Chemistry' ? 90 : 150)
            };
            if (!subjects[targetSubj]) subjects[targetSubj] = [];
            subjects[targetSubj].push(formattedQ);
        });
        return {
            id: paperId,
            title: `JEE Advanced Mock Test ${paperId} (Premium)`,
            durationMinutes: 180,
            sections: Object.keys(subjects).map(s => ({ name: s, questions: subjects[s] }))
        };
    }

    function generatePaperByID(paperId) {
        // PRIORITY 0: Check custom/dynamic papers from Firebase/localStorage
        try {
            const customPapers = JSON.parse(localStorage.getItem("jee_custom_papers") || "[]");
            const custom = customPapers.find(p => String(p.id) === String(paperId));
            if (custom && custom.sections && custom.sections.length > 0) {
                return custom;
            }
        } catch(e) {}

        // Check if marked as deleted
        try {
            const deleted = JSON.parse(localStorage.getItem("jee_deleted_papers") || "[]").map(Number);
            if (deleted.includes(Number(paperId))) {
                return { id: paperId, title: `Mock Paper ${paperId} (Deleted)`, durationMinutes: 180, sections: [] };
            }
        } catch(e) {}

        // PRIORITY 1: Check if Manual Data exists
        if (PAPER_DATABASE[paperId]) {
            return processHardcodedPaper(PAPER_DATABASE[paperId], paperId);
        }
        
        // PRIORITY 2: Procedural Generation (Fallback)
        const subjects = ['Physics', 'Chemistry', 'Mathematics'];
        const sections = subjects.map(subject => {
            const questions = [];
            const topicList = TOPIC_BANKS[subject];
            // 5 MCQs for demo
            for(let i=1; i<=5; i++) {
                const topic = topicList[(paperId + i) % topicList.length];
                const ansIndex = (paperId + i) % 4;
                // Example Math content procedurally generated
                let content = `Concept question on <strong>${topic}</strong>.`;
                if(subject === 'Mathematics') content += " Solve for $x$ in $x^2 + 2x + 1 = 0$.";
                else if(subject === 'Physics') content += " If $F = ma$, find $a$.";
                else content += " Identify the reaction mechanism.";

                questions.push({
                    id: `${subject.substring(0,3)}_p${paperId}_A_${i}`,
                    type: 'MCQ',
                    section: 'Section A',
                    content: content,
                    options: [`Option A ($x=1$)`, `Option B ($x=${i}$)`, `Option C`, `Option D`],
                    answerHash: obfuscate(String(ansIndex))
                });
            }
            // 2 Numericals
            for(let i=1; i<=2; i++) {
                const topic = topicList[(paperId + i + 5) % topicList.length];
                const ansVal = (paperId * i) % 10;
                questions.push({
                    id: `${subject.substring(0,3)}_p${paperId}_B_${i}`,
                    type: 'NUMERICAL',
                    section: 'Section B',
                    content: `Numerical integer problem on <strong>${topic}</strong>. Calculate $\\int_0^1 x dx$.`,
                    answerHash: obfuscate(String(ansVal))
                });
            }
            return { name: subject, questions: questions };
        });

        return { id: paperId, title: `JEE Advanced Mock Test ${paperId}`, durationMinutes: 180, sections: sections };
    }

    // 4. APPLICATION STATE
    let CURRENT_CANDIDATE_ID = "JEEPREMIUM";
    try {
        CURRENT_CANDIDATE_ID = localStorage.getItem("jee_candidate_id") || "JEEPREMIUM";
    } catch(e) {}

    let QUESTION_PACE_INTERVAL = null;
    let QUESTION_TIME_SPENT = 0;

    let ADMIN_STATE = {
        currentTab: 'overview',
        selectedPaperId: 1,
        activePaperData: null,
        editingQuestionIdx: -1
    };

    const STATE = {
        paper: null,
        tempPaper: null,
        sectionIndex: 0,
        questionGlobalIndex: 0,
        answers: {},
        timeRemaining: 0,
        timerInterval: null,
        flatQuestions: [],
        warnings: 0,
        fontSize: 1
    };
    Object.seal(STATE);

    const CONFIG = { marksCorrect: 4, marksWrong: -1, marksUnattempted: 0, maxWarnings: 3 };
    Object.freeze(CONFIG);
    
    const SESSION_KEY = 'jee_sec_session'; 
    const HISTORY_KEY = 'jee_sec_history';
    const PAPER_ORDER_KEY = 'jee_paper_order';

    // 5. SECURITY UTILITIES
    const Security = {
        init: function() {
            window.JEE_SCORE = 0;
            window.DEBUG_MODE = false;
        },
        encryptStorage: function(data) {
            const jsonStr = JSON.stringify(data);
            return obfuscate(jsonStr); 
        },
        decryptStorage: function(rawStr) {
            try {
                if(!rawStr) return null;
                const dec = deobfuscate(rawStr);
                return JSON.parse(dec);
            } catch(e) {
                try { return JSON.parse(rawStr); } catch(err) { return null; }
            }
        }
    };

    // 6. INITIALIZATION
    function populateCalculator() {
        try {
            const keys = [
                'sin','cos','tan','C',
                '(',')','^','/',
                '7','8','9','*',
                '4','5','6','-',
                '1','2','3','+',
                '0','.','='
            ];
            const calcGrid = document.getElementById('calc-keys');
            if (!calcGrid || (calcGrid.children && calcGrid.children.length > 0)) return;
            keys.forEach(k => {
                const btn = document.createElement('button');
                btn.className = `calc-key p-2 rounded text-white font-bold ${k==='C'?'bg-red-600': k==='='?'bg-green-600': ['/','*','-','+'].includes(k)?'bg-orange-500':'bg-gray-600'}`;
                if(k==='0') btn.classList.add('col-span-2');
                btn.innerText = k;
                btn.onclick = () => calcInput(k);
                calcGrid.appendChild(btn);
            });
            setupCalculatorDrag();
        } catch(e) {
            console.warn("populateCalculator error:", e);
        }
    }

    function bootstrapApp() {
        Security.init();
        setupEventListeners();
        populateCalculator();
        renderPaperGrid();
        checkPreviousSession();
        initAdminDashboard();
        window.addEventListener('resize', () => checkOrientation());
        window.addEventListener('beforeunload', (e) => {
            if(!document.getElementById('screen-exam').classList.contains('hidden')) { 
                e.preventDefault(); e.returnValue = ''; 
            }
        });

        // Background sync with Firestore
        try {
            if (typeof FirebaseService !== 'undefined') {
                FirebaseService.getPapers().then(remotePapers => {
                    if (remotePapers && remotePapers.length) {
                        localStorage.setItem("jee_custom_papers", JSON.stringify(remotePapers));
                        renderPaperGrid();
                    }
                }).catch(e => console.warn("Background sync error:", e));
            }
        } catch(e) {}
    }

    // 7. EVENT LISTENERS
    function safeBind(id, event, handler) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, handler);
        }
    }

    function setupEventListeners() {
        const fsBtn = document.getElementById('btn-go-fullscreen');
        if (fsBtn) {
            fsBtn.onclick = () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(e => console.error(e));
                    fsBtn.innerHTML = '<i class="fas fa-compress mr-2"></i> EXIT FULL SCREEN';
                } else {
                    if (document.exitFullscreen) document.exitFullscreen();
                    fsBtn.innerHTML = '<i class="fas fa-expand mr-2"></i> GO FULL SCREEN';
                }
            };
        }

        safeBind('resume-alert', 'click', resumeExamSession);
        
        const closeInst = () => {
            const scInst = document.getElementById('screen-instructions');
            const scSetup = document.getElementById('screen-setup');
            if (scInst) scInst.classList.add('hidden');
            if (scSetup) scSetup.classList.remove('hidden');
        };
        safeBind('btn-close-inst', 'click', closeInst);
        safeBind('btn-close-inst-bottom', 'click', closeInst);
        safeBind('btn-start-exam', 'click', confirmInstructions);
        
        safeBind('btn-toggle-calc', 'click', toggleCalculator);
        safeBind('btn-mob-calc', 'click', toggleCalculator);
        safeBind('btn-close-calc', 'click', toggleCalculator);
        
        safeBind('btn-show-qp', 'click', showQuestionPaper);
        safeBind('btn-mob-qp', 'click', showQuestionPaper);
        safeBind('btn-close-qp', 'click', () => {
            const modal = document.getElementById('modal-qp');
            if (modal) modal.classList.add('hidden');
        });
        
        safeBind('btn-font-inc', 'click', () => resizeFont(1));
        safeBind('btn-font-dec', 'click', () => resizeFont(-1));
        
        safeBind('btn-mobile-menu', 'click', () => {
            const mob = document.getElementById('mobile-menu');
            if (mob) mob.classList.toggle('hidden');
        });
        safeBind('btn-palette-mob', 'click', togglePaletteMobile);
        safeBind('palette-backdrop', 'click', togglePaletteMobile);
        safeBind('btn-close-palette', 'click', togglePaletteMobile);
        
        safeBind('btn-prev', 'click', prevQuestion);
        safeBind('btn-next', 'click', saveAndNext);
        safeBind('btn-clear', 'click', clearResponse);
        safeBind('btn-review', 'click', markForReview);
        
        safeBind('btn-submit-main', 'click', () => {
            const modal = document.getElementById('modal-submit');
            if (modal) modal.classList.remove('hidden');
        });
        safeBind('btn-cancel-submit', 'click', () => {
            const modal = document.getElementById('modal-submit');
            if (modal) modal.classList.add('hidden');
        });
        safeBind('btn-confirm-submit', 'click', finishExam);
        
        safeBind('btn-retake', 'click', retakeTest);
        safeBind('btn-home', 'click', clearSessionAndHome);
        safeBind('btn-resume-warning', 'click', resumeExam);
        safeBind('lightbox-modal', 'click', closeLightbox);
        safeBind('btn-close-lightbox', 'click', closeLightbox);

        // Admin Portal open triggers
        const btnOpenAdmin = document.getElementById('btn-open-admin');
        if (btnOpenAdmin) {
            btnOpenAdmin.onclick = (e) => {
                e.preventDefault();
                if (typeof FirebaseService !== 'undefined' && FirebaseService.isAdminLoggedIn()) {
                    showAdminScreen();
                } else {
                    const passInput = document.getElementById('admin-auth-pass');
                    if (passInput) passInput.value = '';
                    const modal = document.getElementById('modal-admin-auth');
                    if (modal) modal.classList.remove('hidden');
                    if (passInput) setTimeout(() => passInput.focus(), 50);
                }
            };
        }

        safeBind('btn-cancel-admin-auth', 'click', () => {
            const modal = document.getElementById('modal-admin-auth');
            if (modal) modal.classList.add('hidden');
        });

        const formAdminAuth = document.getElementById('form-admin-auth');
        if (formAdminAuth) {
            formAdminAuth.onsubmit = (e) => {
                e.preventDefault();
                const passInput = document.getElementById('admin-auth-pass');
                const pass = passInput ? passInput.value.trim() : '';
                if (typeof FirebaseService !== 'undefined' && FirebaseService.loginAdmin(pass)) {
                    const modal = document.getElementById('modal-admin-auth');
                    if (modal) modal.classList.add('hidden');
                    if (passInput) passInput.value = '';
                    showAdminScreen();
                } else {
                    alert("Invalid passcode! (Default passcode: admin123)");
                }
            };
        }

        // Candidate identity trigger
        safeBind('btn-candidate-badge', 'click', openCandidateIdModal);

        const formCandidateId = document.getElementById('form-candidate-id');
        if (formCandidateId) {
            formCandidateId.onsubmit = saveCandidateId;
        }

        safeBind('btn-cancel-candidate-id', 'click', () => {
            const modal = document.getElementById('modal-candidate-id');
            if (modal) modal.classList.add('hidden');
        });

        safeBind('btn-cancel-paper-access', 'click', () => {
            const modal = document.getElementById('modal-paper-access');
            if (modal) modal.classList.add('hidden');
        });

        const formPaperAccess = document.getElementById('form-paper-access');
        if (formPaperAccess) {
            formPaperAccess.onsubmit = handlePaperAccessSubmit;
        }
    }

    // 8. LOGIC IMPLEMENTATION
    function updateCandidateIdDisplay() {
        const el = document.getElementById('display-candidate-id');
        if (el) el.innerText = CURRENT_CANDIDATE_ID;
    }

    function openCandidateIdModal() {
        document.getElementById('input-candidate-id').value = CURRENT_CANDIDATE_ID;
        document.getElementById('modal-candidate-id').classList.remove('hidden');
    }

    function saveCandidateId(e) {
        e.preventDefault();
        const newId = document.getElementById('input-candidate-id').value.trim().toUpperCase();
        if (newId) {
            CURRENT_CANDIDATE_ID = newId;
            localStorage.setItem("jee_candidate_id", newId);
            updateCandidateIdDisplay();
            document.getElementById('modal-candidate-id').classList.add('hidden');
            renderPaperGrid();
        }
    }

    function getPaperOrder() {
        let deleted = [];
        try {
            deleted = JSON.parse(localStorage.getItem("jee_deleted_papers") || "[]").map(Number);
        } catch(e) {}

        let order = Array.from({length: 10}, (_, i) => i + 1).filter(pid => !deleted.includes(pid));
        try {
            const customPapers = JSON.parse(localStorage.getItem("jee_custom_papers") || "[]");
            customPapers.forEach(p => {
                const pid = Number(p.id);
                if (pid && !order.includes(pid) && !deleted.includes(pid)) {
                    order.push(pid);
                }
            });
        } catch(e) {}
        return order;
    }

    async function renderPaperGrid() {
        const grid = document.getElementById('paper-grid');
        if (!grid) return;
        const order = getPaperOrder();
        updateCandidateIdDisplay();

        // Look up per-student paper restrictions
        let studentAllowedPapers = null; // null = no restriction (show all)
        try {
            const cleanId = String(CURRENT_CANDIDATE_ID || '').trim().toUpperCase();
            if (cleanId && cleanId !== 'JEEPREMIUM' && typeof FirebaseService !== 'undefined') {
                const students = await FirebaseService.getStudents();
                const matchedStudent = students.find(s => String(s.candidateId).trim().toUpperCase() === cleanId);
                if (matchedStudent) {
                    const allowed = String(matchedStudent.allowedPapers || 'ALL').trim().toUpperCase();
                    if (allowed !== 'ALL') {
                        studentAllowedPapers = allowed.split(',').map(x => x.trim()).filter(Boolean);
                    }
                }
            }
        } catch(e) {}

        let history = {};
        try {
            const rawHist = localStorage.getItem(HISTORY_KEY);
            if (rawHist) {
                const decrypted = Security.decryptStorage(rawHist);
                if (decrypted) history = decrypted;
            }
        } catch (e) { }
        
        grid.innerHTML = order.map((pid, index) => {
            const prev = history[pid] || history[String(pid)];
            const displayNum = pid;
            const paperData = generatePaperByID(pid);
            const accessMode = paperData.accessMode || "PUBLIC";

            // Count total questions & max marks for this paper
            let totalQ = 0;
            let paperMaxMarks = 0;
            const defaultPos = typeof paperData.marksCorrect === 'number' ? paperData.marksCorrect : 4;
            const defaultNeg = typeof paperData.marksNegative === 'number' ? paperData.marksNegative : -1;
            
            if (paperData.sections && paperData.sections.length > 0) {
                paperData.sections.forEach(s => {
                    totalQ += s.questions.length;
                    s.questions.forEach(q => {
                        paperMaxMarks += typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
                    });
                });
            }
            if (totalQ === 0) totalQ = 90;
            if (paperMaxMarks === 0) paperMaxMarks = totalQ * defaultPos;

            const marksLabel = `+${defaultPos} / ${defaultNeg >= 0 ? '+' : ''}${defaultNeg} Marking`;

            // Check if this student is restricted from this paper
            const isStudentLocked = studentAllowedPapers && !studentAllowedPapers.includes(String(pid));

            let accessBadge = '';
            if (isStudentLocked) {
                accessBadge = '<span class="badge-access-whitelist text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fas fa-lock mr-1"></i>No Access</span>';
            } else if (accessMode === 'PIN_PROTECTED') {
                accessBadge = '<span class="badge-access-pin text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fas fa-key mr-1"></i>PIN</span>';
            } else if (accessMode === 'WHITELIST') {
                accessBadge = '<span class="badge-access-whitelist text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fas fa-user-lock mr-1"></i>Restricted</span>';
            }

            if (isStudentLocked) {
                // Render a locked/greyed-out card — not clickable
                return `
                <div class="paper-card p-4 relative flex flex-col justify-between opacity-40 cursor-not-allowed select-none" style="filter:grayscale(1)">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="tag-unlocked" style="background:rgba(100,116,139,0.2);color:#64748b"><i class="fas fa-lock mr-1"></i>LOCKED</span>
                            <div class="flex items-center gap-1">
                                ${accessBadge}
                                <span class="text-[10px] text-slate-500 font-mono">Paper ${displayNum}</span>
                            </div>
                        </div>
                        <h3 class="text-slate-400 text-base font-bold mb-1">${paperData.title || ('Mock Exam ' + displayNum)}</h3>
                        <p class="text-slate-600 text-xs mb-3 font-normal">Not available for your account</p>
                        <div class="flex gap-1.5 mb-4">
                            <span class="subj-pill">Physics</span>
                            <span class="subj-pill">Chemistry</span>
                            <span class="subj-pill">Maths</span>
                        </div>
                    </div>
                    <button class="btn-start-test" disabled style="opacity:0.4;cursor:not-allowed"><i class="fas fa-lock mr-1.5 text-xs"></i>Access Denied</button>
                </div>`;
            } else if (prev) {
                const maxDisplay = prev.maxScore || paperMaxMarks;
                return `
                <div class="paper-card paper-card-completed p-4 relative group shadow-lg flex flex-col justify-between" data-pid="${pid}">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="tag-completed"><i class="fas fa-check-circle mr-1"></i>COMPLETED</span>
                            <div class="flex items-center gap-1">
                                ${accessBadge}
                                <span class="text-[10px] text-emerald-300 font-mono">Paper ${displayNum}</span>
                            </div>
                        </div>
                        <h3 class="text-white text-base font-bold mb-1">${paperData.title || ('Mock Exam ' + displayNum)}</h3>
                        <div class="flex gap-1.5 mb-3">
                            <span class="subj-pill">Physics</span>
                            <span class="subj-pill">Chemistry</span>
                            <span class="subj-pill">Maths</span>
                        </div>
                        <div class="mb-3 bg-slate-900/60 rounded-xl p-2.5 border border-emerald-500/20">
                            <div class="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Score Achieved</div>
                            <div class="flex items-baseline space-x-1.5">
                                <span class="text-2xl font-black ${prev.score >= 0 ? 'text-emerald-400' : 'text-red-400'}">${prev.score}</span>
                                <span class="text-xs text-slate-500 font-medium">/ ${maxDisplay}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn-retake-test"><i class="fas fa-redo-alt mr-1.5"></i>Retake Test</button>
                </div>`;
            } else {
                return `
                <div class="paper-card paper-card-unlocked p-4 relative group cursor-pointer flex flex-col justify-between" data-pid="${pid}">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="tag-unlocked"><i class="fas fa-unlock-alt mr-1"></i>AVAILABLE</span>
                            <div class="flex items-center gap-1">
                                ${accessBadge}
                                <span class="text-[10px] text-blue-300 font-mono">Paper ${displayNum}</span>
                            </div>
                        </div>
                        <h3 class="text-white text-base font-bold mb-1">${paperData.title || ('Mock Exam ' + displayNum)}</h3>
                        <p class="text-slate-400 text-xs mb-3 font-normal">${totalQ} Questions &bull; ${marksLabel} &bull; ${paperData.durationMinutes || 180} mins</p>
                        <div class="flex gap-1.5 mb-4">
                            <span class="subj-pill">Physics</span>
                            <span class="subj-pill">Chemistry</span>
                            <span class="subj-pill">Maths</span>
                        </div>
                    </div>
                    <button class="btn-start-test"><i class="fas fa-play mr-1.5 text-xs"></i>Start Exam</button>
                </div>`;
            }
        }).join('');
        
        grid.querySelectorAll('[data-pid]').forEach(el => {
            el.onclick = (e) => {
                let pid = el.getAttribute('data-pid');
                if(!pid) pid = e.target.closest('[data-pid]').getAttribute('data-pid');
                if(pid) verifyAndPreparePaper(parseInt(pid));
            };
        });
    }

    async function verifyAndPreparePaper(id) {
        try {
            const paper = generatePaperByID(id);

            if (typeof FirebaseService !== 'undefined') {
                // 1. Always check the student whitelist for per-student paper restrictions
                const cleanId = String(CURRENT_CANDIDATE_ID || '').trim().toUpperCase();
                if (cleanId && cleanId !== 'JEEPREMIUM') {
                    const students = await FirebaseService.getStudents();
                    const matchedStudent = students.find(s => String(s.candidateId).trim().toUpperCase() === cleanId);
                    if (matchedStudent) {
                        const allowed = String(matchedStudent.allowedPapers || 'ALL').trim().toUpperCase();
                        if (allowed !== 'ALL') {
                            const allowedIds = allowed.split(',').map(x => x.trim()).filter(Boolean);
                            if (!allowedIds.includes(String(id))) {
                                alert(`You are not authorized to access Mock Paper ${id}.\nYour allowed papers are: ${allowedIds.join(', ')}`);
                                return;
                            }
                        }
                    }
                }

                // 2. Check paper-level access mode (PIN / WHITELIST)
                const authCheck = await FirebaseService.isCandidateAuthorizedForPaper(CURRENT_CANDIDATE_ID, paper);
                if (authCheck && authCheck.requiresPin) {
                    const tid = document.getElementById('access-target-paper-id');
                    if (tid) tid.value = id;
                    const pinInp = document.getElementById('input-paper-access-pin');
                    if (pinInp) pinInp.value = '';
                    const msg = document.getElementById('paper-access-msg');
                    if (msg) msg.innerText = `"${paper.title || ('Paper ' + id)}" is passcode protected. Please enter access PIN:`;
                    const modal = document.getElementById('modal-paper-access');
                    if (modal) modal.classList.remove('hidden');
                    return;
                }

                if (authCheck && !authCheck.authorized) {
                    alert(authCheck.reason || 'You are not authorized to attempt this mock exam.');
                    return;
                }
            }
            preparePaper(id);
        } catch(e) {
            console.warn('verifyAndPreparePaper fallback:', e);
            preparePaper(id);
        }
    }

    function handlePaperAccessSubmit(e) {
        e.preventDefault();
        const paperId = parseInt(document.getElementById('access-target-paper-id').value);
        const enteredPin = document.getElementById('input-paper-access-pin').value.trim();
        const paper = generatePaperByID(paperId);

        if (paper.accessPin && paper.accessPin !== enteredPin) {
            alert("Invalid Exam Passcode! Please check and try again.");
            return;
        }

        document.getElementById('modal-paper-access').classList.add('hidden');
        preparePaper(paperId);
    }

    function preparePaper(id) {
        STATE.tempPaper = generatePaperByID(id);
        
        // Count total questions, total max score & calculated duration
        let totalQ = 0;
        let sumSec = 0;
        let totalMaxScore = 0;
        const defaultPos = typeof STATE.tempPaper.marksCorrect === 'number' ? STATE.tempPaper.marksCorrect : 4;
        const defaultNeg = typeof STATE.tempPaper.marksNegative === 'number' ? STATE.tempPaper.marksNegative : -1;

        STATE.tempPaper.sections.forEach(s => {
            totalQ += s.questions.length;
            s.questions.forEach(q => {
                sumSec += (q.timeLimitSec || (s.name === 'Physics' ? 120 : s.name === 'Chemistry' ? 90 : 150));
                const qPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
                totalMaxScore += qPos;
            });
        });

        const calcDurationMins = STATE.tempPaper.durationMinutes || Math.max(10, Math.ceil(sumSec / 60));
        STATE.tempPaper.durationMinutes = calcDurationMins;

        document.getElementById('inst-paper-name').innerText = STATE.tempPaper.title;
        document.getElementById('inst-total-q').innerText = totalQ;
        document.getElementById('inst-q-breakdown').innerText = `${STATE.tempPaper.sections.map(s => s.questions.length + ' ' + s.name).join(', ')}`;
        document.getElementById('inst-duration-display').innerText = `${Math.floor(calcDurationMins / 60)}h ${calcDurationMins % 60 ? (calcDurationMins % 60) + 'm' : ''}`;
        document.getElementById('inst-duration-sub').innerText = `${calcDurationMins} minutes total`;

        // Dynamic marking scheme
        const instCorrect = document.getElementById('inst-marks-correct');
        if (instCorrect) instCorrect.innerText = `+${defaultPos}`;
        const instCorrectSub = document.getElementById('inst-marks-correct-sub');
        if (instCorrectSub) instCorrectSub.innerText = `per question (Total ${totalMaxScore} marks)`;
        const instNegative = document.getElementById('inst-marks-negative');
        if (instNegative) instNegative.innerText = `${defaultNeg >= 0 ? '+' : '−'}${Math.abs(defaultNeg)}`;

        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-instructions').classList.remove('hidden');
    }

    function confirmInstructions() { startExam(STATE.tempPaper); }
    function checkPreviousSession() { if(localStorage.getItem(SESSION_KEY)) document.getElementById('resume-alert').classList.remove('hidden'); }
    
    function resumeExamSession() {
        const savedRaw = localStorage.getItem(SESSION_KEY);
        if(!savedRaw) return;
        const saved = Security.decryptStorage(savedRaw);
        if(!saved) { alert("Session corrupted"); localStorage.removeItem(SESSION_KEY); return; }
        
        Object.assign(STATE, saved);
        
        if (STATE.paper && STATE.paper.sections) {
            STATE.flatQuestions = [];
            STATE.paper.sections.forEach((sec, sIdx) => {
                sec.questions.forEach((q, qIdx) => {
                    STATE.flatQuestions.push({ ...q, sectionIndex: sIdx, localIndex: qIdx, sectionName: sec.name });
                });
            });
        }

        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-instructions').classList.add('hidden');
        document.getElementById('screen-exam').classList.remove('hidden');
        document.getElementById('screen-exam').classList.add('flex');
        document.getElementById('exam-name-display').innerText = STATE.paper.title;
        enableProctoring();
        checkOrientation();
        renderSubjectTabs();
        startTimer();
        loadQuestion(saved.questionGlobalIndex);
    }

    function startExam(paper) {
        STATE.paper = paper;
        STATE.timeRemaining = (paper.durationMinutes || 180) * 60;
        STATE.warnings = 0;
        STATE.answers = {};
        STATE.flatQuestions = [];
        STATE.fontSize = 1;

        paper.sections.forEach((sec, sIdx) => {
            const questions = [...sec.questions];
            // Shuffle
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            sec.questions = questions;
            questions.forEach((q, qIdx) => {
                STATE.flatQuestions.push({ ...q, sectionIndex: sIdx, localIndex: qIdx, sectionName: sec.name });
                STATE.answers[q.id] = { value: null, status: 'not-visited', timeSpentSec: 0 };
            });
        });

        document.getElementById('screen-instructions').classList.add('hidden');
        document.getElementById('screen-exam').classList.remove('hidden');
        document.getElementById('screen-exam').classList.add('flex');
        document.getElementById('exam-name-display').innerText = paper.title;

        generateWatermark();
        enableProctoring();
        checkOrientation();
        renderSubjectTabs();
        startTimer();
        loadQuestion(0);
        saveSession();
    }

    function loadQuestion(index) {
        if(index < 0 || index >= STATE.flatQuestions.length) return;
        STATE.questionGlobalIndex = index;
        const q = STATE.flatQuestions[index];
        STATE.sectionIndex = q.sectionIndex;

        renderSubjectTabs();

        const ans = STATE.answers[q.id];
        if(ans.status === 'not-visited') ans.status = 'not-answered';

        document.getElementById('q-num').innerText = q.localIndex + 1;
        document.getElementById('q-type-badge').innerText = q.type;
        
        const secBadge = document.getElementById('section-badge');
        if (secBadge) {
            secBadge.innerText = q.section || (q.type === 'MCQ' ? 'Section A' : 'Section B');
            secBadge.className = (q.section === 'Section B' || q.type !== 'MCQ') ? 'section-b-badge self-start' : 'section-a-badge self-start';
        }
        
        // --- Per-Question Live Pacing Timer ---
        if (QUESTION_PACE_INTERVAL) clearInterval(QUESTION_PACE_INTERVAL);
        QUESTION_TIME_SPENT = ans.timeSpentSec || 0;
        const targetSec = q.timeLimitSec || (q.sectionName === 'Physics' ? 120 : q.sectionName === 'Chemistry' ? 90 : 150);
        
        const targetMinStr = Math.floor(targetSec / 60) + ':' + String(targetSec % 60).padStart(2, '0');
        const targetEl = document.getElementById('q-target-time');
        if (targetEl) targetEl.innerText = `/ ${targetMinStr}`;

        const updatePaceDisplay = () => {
            const m = Math.floor(QUESTION_TIME_SPENT / 60);
            const s = QUESTION_TIME_SPENT % 60;
            const timeEl = document.getElementById('q-pace-time');
            if (timeEl) timeEl.innerText = `${m}:${String(s).padStart(2, '0')}`;

            const widget = document.getElementById('q-pace-widget');
            if (widget) {
                if (QUESTION_TIME_SPENT > targetSec) {
                    widget.className = "hidden sm:inline-flex pace-timer-widget pace-timer-exceeded";
                } else {
                    widget.className = "hidden sm:inline-flex pace-timer-widget pace-timer-normal";
                }
            }
        };
        updatePaceDisplay();

        QUESTION_PACE_INTERVAL = setInterval(() => {
            QUESTION_TIME_SPENT++;
            ans.timeSpentSec = QUESTION_TIME_SPENT;
            updatePaceDisplay();
        }, 1000);

        // --- Per-Question Marks Badge ---
        const qMarksBadge = document.getElementById('q-marks-badge');
        const qPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : (STATE.paper && typeof STATE.paper.marksCorrect === 'number' ? STATE.paper.marksCorrect : 4);
        const qNeg = typeof q.marksNegative === 'number' ? q.marksNegative : (STATE.paper && typeof STATE.paper.marksNegative === 'number' ? STATE.paper.marksNegative : -1);
        if (qMarksBadge) {
            document.getElementById('q-marks-correct-val').innerText = qPos;
            document.getElementById('q-marks-negative-val').innerText = Math.abs(qNeg);
            qMarksBadge.classList.remove('hidden');
        }

        const contentDiv = document.getElementById('question-text');
        contentDiv.innerHTML = q.content;
        contentDiv.style.fontSize = `${STATE.fontSize}rem`;

        // --- Question Image Display (if URL provided) ---
        const qImageWrap = document.getElementById('q-image-wrap');
        const qImage = document.getElementById('q-image');
        const imgUrl = q.imageUrl || q.image;
        if (imgUrl && qImageWrap && qImage) {
            qImage.src = imgUrl;
            qImageWrap.classList.remove('hidden');
        } else if (qImageWrap) {
            qImageWrap.classList.add('hidden');
        }

        const optsDiv = document.getElementById('options-area');
        optsDiv.innerHTML = '';
        optsDiv.style.fontSize = `${STATE.fontSize}rem`;

        if(q.type === 'MCQ') {
            const letters = ['A', 'B', 'C', 'D'];
            q.options.forEach((opt, i) => {
                const isSel = ans.value === i;
                const optEl = document.createElement('div');
                optEl.className = `option-card ${isSel ? 'selected' : ''}`;
                optEl.innerHTML = `
                    <div class="option-letter">${letters[i] || (i + 1)}</div>
                    <div class="text-gray-800 font-medium text-sm md:text-base leading-relaxed flex-1">${opt}</div>
                `;
                optEl.onclick = () => selectOption(i);
                optsDiv.appendChild(optEl);
            });
        } else {
            const wrap = document.createElement('div');
            wrap.className = 'flex flex-col max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4';
            wrap.innerHTML = `<label class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Numerical Value Answer:</label>`;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none w-full font-mono text-xl text-gray-900 font-bold transition-all';
            input.placeholder = 'e.g. 25 or 3.14';
            input.value = ans.value || '';
            input.oninput = (e) => inputNumerical(e.target.value);
            wrap.appendChild(input);
            optsDiv.appendChild(wrap);
        }

        renderPalette();
        setupImageLightbox();
        
        // MATH RENDER FIX
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.getElementById('question-area'), { 
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\(", right: "\\)", display: false},
                    {left: "\\[", right: "\\]", display: true}
                ],
                throwOnError: false
            });
        }
        
        document.getElementById('btn-prev').disabled = index === 0;
        document.getElementById('btn-next').innerText = index === STATE.flatQuestions.length - 1 ? 'Save & Submit' : 'Save & Next';
        saveSession(); 
    }

    function selectOption(idx) { STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id].value = idx; loadQuestion(STATE.questionGlobalIndex); }
    function inputNumerical(val) { STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id].value = val; }
    
    function saveAndNext() {
        const ans = STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id];
        if(ans.value !== null && ans.value !== "") ans.status = (ans.status.includes('marked')) ? 'marked-answered' : 'answered';
        else if(!ans.status.includes('marked')) ans.status = 'not-answered';
        
        if(STATE.questionGlobalIndex < STATE.flatQuestions.length - 1) loadQuestion(STATE.questionGlobalIndex + 1);
        else document.getElementById('modal-submit').classList.remove('hidden');
    }
    
    function prevQuestion() { loadQuestion(STATE.questionGlobalIndex - 1); }
    function markForReview() {
        const ans = STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id];
        ans.status = (ans.value !== null && ans.value !== "") ? 'marked-answered' : 'marked';
        loadQuestion(STATE.questionGlobalIndex + 1);
    }
    function clearResponse() {
        const ans = STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id];
        ans.value = null; ans.status = 'not-answered';
        loadQuestion(STATE.questionGlobalIndex);
    }
    function resizeFont(d) { STATE.fontSize = Math.min(1.5, Math.max(0.8, STATE.fontSize + d * 0.1)); loadQuestion(STATE.questionGlobalIndex); }

    function renderPalette() {
        const questions = STATE.flatQuestions.filter(q => q.sectionIndex === STATE.sectionIndex);
        if (questions.length === 0) return;
        
        document.getElementById('palette-section-title').innerText = questions[0].sectionName || questions[0].section;
        
        const answeredSec = questions.filter(q => {
            const a = STATE.answers[q.id];
            return a && (a.status === 'answered' || a.status === 'marked-answered');
        }).length;
        
        const statsEl = document.getElementById('palette-stats');
        if (statsEl) {
            statsEl.innerText = `${answeredSec}/${questions.length} Attempted`;
        }

        document.getElementById('question-grid').innerHTML = questions.map(q => {
            const ans = STATE.answers[q.id];
            let cls = "status-btn ";
            if(STATE.questionGlobalIndex === STATE.flatQuestions.indexOf(q)) cls += "st-current ";
            if(ans.status === 'answered') cls += "st-answered";
            else if(ans.status === 'not-answered') cls += "st-not-answered";
            else if(ans.status === 'marked') cls += "st-marked";
            else if(ans.status === 'marked-answered') cls += "st-marked-answered";
            else cls += "st-not-visited";
            
            return `<div data-idx="${STATE.flatQuestions.indexOf(q)}" class="${cls}">${q.localIndex + 1}</div>`;
        }).join('');
        
        document.querySelectorAll('#question-grid div').forEach(el => {
            el.onclick = () => loadQuestion(parseInt(el.getAttribute('data-idx')));
        });
    }

    function renderSubjectTabs() {
        const tabsContainer = document.getElementById('subject-tabs');
        if (!tabsContainer || !STATE.paper) return;

        tabsContainer.innerHTML = STATE.paper.sections.map((sec, idx) => {
            const totalInSec = sec.questions.length;
            const answeredInSec = sec.questions.filter(q => {
                const a = STATE.answers[q.id];
                return a && (a.status === 'answered' || a.status === 'marked-answered');
            }).length;
            
            const isActive = idx === STATE.sectionIndex;
            return `
            <button data-sec="${idx}" class="whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 ${isActive ? 'tab-active' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}">
                <span>${sec.name}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 font-mono'}">${answeredInSec}/${totalInSec}</span>
            </button>
            `;
        }).join('');

        tabsContainer.querySelectorAll('button').forEach(el => {
            el.onclick = () => switchSection(parseInt(el.getAttribute('data-sec')));
        });
    }

    function switchSection(secIdx) {
        const idx = STATE.flatQuestions.findIndex(q => q.sectionIndex === secIdx);
        if(idx !== -1) loadQuestion(idx);
    }

    function finishExam() {
        clearInterval(STATE.timerInterval);
        if (QUESTION_PACE_INTERVAL) clearInterval(QUESTION_PACE_INTERVAL);
        disableProctoring();
        localStorage.removeItem(SESSION_KEY);
        document.getElementById('screen-exam').classList.add('hidden');
        document.getElementById('modal-submit').classList.add('hidden');
        document.getElementById('screen-result').classList.remove('hidden');

        let score = 0, correct = 0, wrong = 0;
        let totalMaxScore = 0;
        let tbody = document.getElementById('result-table-body');
        tbody.innerHTML = '';

        const defaultPos = (STATE.paper && typeof STATE.paper.marksCorrect === 'number') ? STATE.paper.marksCorrect : CONFIG.marksCorrect;
        const defaultNeg = (STATE.paper && typeof STATE.paper.marksNegative === 'number') ? STATE.paper.marksNegative : CONFIG.marksWrong;
        
        STATE.flatQuestions.forEach((q, idx) => {
            const qMarksPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
            const qMarksNeg = typeof q.marksNegative === 'number' ? q.marksNegative : defaultNeg;
            totalMaxScore += qMarksPos;

            const ans = STATE.answers[q.id];
            let userDisp = '—';
            let resultStatus = 'Unattempted';
            let rowClass = 'result-row-neutral';
            
            const correctHash = q.answerHash;
            let isCorrect = false;

            if (ans.value !== null && ans.value !== '') {
                if (q.type === 'MCQ') {
                    const selectedText = q.options && q.options[ans.value] !== undefined ? q.options[ans.value] : String(ans.value);
                    userDisp = selectedText;
                    
                    const userHashText = obfuscate(String(selectedText));
                    const userHashIndex = obfuscate(String(ans.value));
                    const userHashLetter = obfuscate(String.fromCharCode(65 + Number(ans.value)));
                    const plainAns = q.answer !== undefined ? String(q.answer).trim() : (correctHash ? deobfuscate(correctHash) : '');
                    
                    if (
                        userHashText === correctHash ||
                        userHashIndex === correctHash ||
                        userHashLetter === correctHash ||
                        (plainAns && (
                            plainAns === String(selectedText).trim() ||
                            plainAns === String(ans.value).trim() ||
                            plainAns.toUpperCase() === String.fromCharCode(65 + Number(ans.value))
                        ))
                    ) {
                        isCorrect = true;
                    }
                } else {
                    userDisp = String(ans.value).trim();
                    const plainAns = q.answer !== undefined ? String(q.answer).trim() : (correctHash ? deobfuscate(correctHash).trim() : '');
                    const userHash = obfuscate(userDisp);
                    
                    if (
                        userHash === correctHash ||
                        (plainAns && (
                            userDisp.toLowerCase() === plainAns.toLowerCase() ||
                            (!isNaN(Number(userDisp)) && !isNaN(Number(plainAns)) && Math.abs(Number(userDisp) - Number(plainAns)) < 0.0001)
                        ))
                    ) {
                        isCorrect = true;
                    }
                }
                
                if (isCorrect) {
                    score += qMarksPos; correct++;
                    resultStatus = 'Correct';
                    rowClass = 'result-row-correct';
                } else {
                    score += qMarksNeg; wrong++;
                    resultStatus = 'Wrong';
                    rowClass = 'result-row-wrong';
                }
            }

            const trunc = (str) => String(str).length > 30 ? String(str).substring(0, 30) + '…' : str;
            
            const resultBadge = resultStatus === 'Correct'
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold"><i class="fas fa-check text-[9px]"></i> Correct (+${qMarksPos})</span>`
                : resultStatus === 'Wrong'
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold"><i class="fas fa-times text-[9px]"></i> Wrong (${qMarksNeg})</span>`
                : `<span class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">Skipped (0)</span>`;

            tbody.innerHTML += `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors ${rowClass}">
                    <td class="px-4 py-3 font-bold text-gray-700">${idx + 1}</td>
                    <td class="px-4 py-3 text-gray-500 text-xs font-semibold">${q.sectionName || q.section || '—'}</td>
                    <td class="px-4 py-3 text-gray-700 max-w-[200px] truncate">${trunc(userDisp)}</td>
                    <td class="px-4 py-3">${resultBadge}</td>
                </tr>`;
        });

        document.getElementById('res-score').innerText = score;
        document.getElementById('res-correct').innerText = correct;
        document.getElementById('res-wrong').innerText = wrong;

        const maxScoreEl = document.getElementById('res-max-score');
        if (maxScoreEl) maxScoreEl.innerText = totalMaxScore || 300;

        const resTitle = document.getElementById('result-paper-title');
        if (resTitle && STATE.paper) resTitle.innerText = STATE.paper.title;
        
        const scoreBar = document.getElementById('score-bar');
        if (scoreBar) {
            const denom = totalMaxScore > 0 ? totalMaxScore : 300;
            const pct = Math.max(0, Math.min(100, Math.round((score / denom) * 100)));
            setTimeout(() => { scoreBar.style.width = pct + '%'; }, 100);
        }

        try {
            let hist = {};
            const rawHist = localStorage.getItem(HISTORY_KEY);
            if (rawHist) {
                const decrypted = Security.decryptStorage(rawHist);
                if (decrypted) hist = decrypted;
            }
            const paperId = STATE.paper && STATE.paper.id ? STATE.paper.id : 0;
            if(paperId > 0) {
                hist[paperId] = { score, maxScore: totalMaxScore || 300, timestamp: new Date().toISOString() };
                localStorage.setItem(HISTORY_KEY, Security.encryptStorage(hist));
            }
        } catch(e) { }

        // Log submission to Firebase / Local
        try {
            if (typeof FirebaseService !== 'undefined') {
                FirebaseService.saveSubmission({
                    candidateId: CURRENT_CANDIDATE_ID,
                    paperId: STATE.paper ? STATE.paper.id : 'N/A',
                    paperTitle: STATE.paper ? STATE.paper.title : 'Mock Exam',
                    score: score,
                    correct: correct,
                    wrong: wrong,
                    maxScore: totalMaxScore || 300,
                    totalQuestions: STATE.flatQuestions.length,
                    answers: STATE.answers,
                    timeTakenSeconds: STATE.paper ? ((STATE.paper.durationMinutes * 60) - STATE.timeRemaining) : 0
                });
            }
        } catch(e) {
            console.warn("Could not log test submission:", e);
        }
        
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(tbody, { 
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ],
                throwOnError: false
            });
        }
    }

    function retakeTest() {
        const pid = STATE.paper.id;
        localStorage.removeItem(SESSION_KEY);
        document.getElementById('screen-result').classList.add('hidden');
        preparePaper(pid);
        confirmInstructions();
    }
    
    function clearSessionAndHome() { localStorage.removeItem(SESSION_KEY); location.reload(); }

    function startTimer() {
        if(STATE.timerInterval) clearInterval(STATE.timerInterval);
        STATE.timerInterval = setInterval(() => {
            STATE.timeRemaining--;
            saveSession();
            if(STATE.timeRemaining <= 0) finishExam();
            const h = Math.floor(STATE.timeRemaining / 3600);
            const m = Math.floor((STATE.timeRemaining % 3600) / 60);
            const s = STATE.timeRemaining % 60;
            document.getElementById('timer-display').innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }, 1000);
    }

    function saveSession() {
        const cleanState = {
            paper: STATE.paper, timeRemaining: STATE.timeRemaining, answers: STATE.answers,
            questionGlobalIndex: STATE.questionGlobalIndex, warnings: STATE.warnings
        };
        localStorage.setItem(SESSION_KEY, Security.encryptStorage(cleanState));
    }

    function enableProctoring() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(()=>{});
        document.addEventListener("visibilitychange", visibilityHandler);
        window.addEventListener("blur", triggerWarning);
    }
    
    function disableProctoring() {
        if(document.exitFullscreen) document.exitFullscreen().catch(()=>{});
        document.removeEventListener("visibilitychange", visibilityHandler);
        window.removeEventListener("blur", triggerWarning);
    }
    
    function visibilityHandler() { if(document.hidden) triggerWarning(); }
    
    function triggerWarning() {
        if(document.getElementById('screen-exam').classList.contains('hidden') || !document.getElementById('modal-warning').classList.contains('hidden')) return;
        STATE.warnings++;
        document.getElementById('warning-count').innerText = STATE.warnings;
        saveSession();

        // Log proctoring violation to Firebase
        try {
            if (typeof FirebaseService !== 'undefined') {
                FirebaseService.logViolation({
                    candidateId: CURRENT_CANDIDATE_ID,
                    paperId: STATE.paper ? STATE.paper.id : 'N/A',
                    paperTitle: STATE.paper ? STATE.paper.title : 'Mock Exam',
                    warningCount: STATE.warnings,
                    violationType: document.hidden ? 'Tab Switch / Browser Minimized' : 'Window Focus Lost / Desktop Interaction'
                });
            }
        } catch(e) {
            console.warn("Could not log violation:", e);
        }

        if (STATE.warnings > CONFIG.maxWarnings) { 
            disableProctoring(); 
            alert("Maximum security violations reached. Exam auto-submitted."); 
            finishExam(); 
        } 
        else document.getElementById('modal-warning').classList.remove('hidden');
    }
    
    function resumeExam() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(()=>{});
        document.getElementById('modal-warning').classList.add('hidden');
    }

    function checkOrientation() {
        const overlay = document.getElementById('orientation-overlay');
        if(document.getElementById('screen-exam').classList.contains('hidden')) { 
            overlay.classList.add('hidden'); 
            return; 
        }
        if(window.innerHeight > window.innerWidth) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    function generateWatermark() {
        const c = document.getElementById('exam-watermark');
        c.innerHTML = "";
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        const userString = CURRENT_CANDIDATE_ID;

        const count = 50; 
        let html = "";
        for(let i=0; i<count; i++) {
            html += `
            <div class="watermark-item">
                <div>ID: ${userString}</div>
                <div class="watermark-ts">${dateString} ${timeString}</div>
            </div>`;
        }
        c.innerHTML = html;
        setTimeout(generateWatermark, 60000);
    }

    function toggleCalculator() { document.getElementById('calc-modal').classList.toggle('hidden'); document.getElementById('mobile-menu').classList.add('hidden'); }
    function togglePaletteMobile() { document.getElementById('palette-sidebar').classList.toggle('translate-x-full'); document.getElementById('palette-backdrop').classList.toggle('hidden'); }
    function showQuestionPaper() {
        const content = document.getElementById('qp-content');
        content.innerHTML = STATE.flatQuestions.map((q, idx) => `
            <div class="mb-4 border-b pb-2"><div class="font-bold text-gray-700 mb-1">Q${idx+1}. ${q.type}</div><div class="mb-1">${q.content}</div></div>`).join('');
        
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(content, { 
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\(", right: "\\)", display: false},
                    {left: "\\[", right: "\\]", display: true}
                ],
                throwOnError: false
            });
        }
        
        document.getElementById('modal-qp').classList.remove('hidden');
    }
    
    let calcExp = "";
    function calcInput(v) { if(v === 'C') calcExp = ""; else calcExp += v; document.getElementById('calc-display').value = calcExp; }
    
    function setupCalculatorDrag() {
        const el = document.getElementById('calc-modal'), h = document.getElementById('calc-header');
        let isDown = false, off = [0,0];
        const start = (x,y) => { isDown = true; off = [el.offsetLeft - x, el.offsetTop - y]; };
        const move = (x,y) => { if(isDown) { el.style.left = (x + off[0]) + 'px'; el.style.top = (y + off[1]) + 'px'; }};
        h.addEventListener('mousedown', e => start(e.clientX, e.clientY));
        document.addEventListener('mouseup', () => isDown = false);
        document.addEventListener('mousemove', e => move(e.clientX, e.clientY));
        h.addEventListener('touchstart', e => start(e.touches[0].clientX, e.touches[0].clientY));
        document.addEventListener('touchend', () => isDown = false);
        document.addEventListener('touchmove', e => move(e.touches[0].clientX, e.touches[0].clientY));
    }
    
    function closeLightbox() { document.getElementById('lightbox-modal').classList.add('hidden'); }
    function setupImageLightbox() {
        document.querySelectorAll('#question-text img, #options-area img').forEach(img => {
            img.onclick = (e) => { e.stopPropagation(); document.getElementById('lightbox-img').src = img.src; document.getElementById('lightbox-modal').classList.remove('hidden'); };
            img.onerror = function() {
                this.onerror = null;
                this.parentElement.innerHTML += '<div class="text-xs text-red-500 italic text-center p-2 border border-red-200 bg-red-50 rounded mt-2">Image Error</div>';
                this.style.display = 'none';
            };
        });
    }

    // =============================================
    // 9. ADMIN DASHBOARD & FIREBASE CONTROLLER
    // =============================================
    function initAdminDashboard() {
        // Setup Admin Auth Triggers
        const btnOpenAdmin = document.getElementById('btn-open-admin');
        if (btnOpenAdmin) {
            btnOpenAdmin.onclick = () => {
                if (FirebaseService.isAdminLoggedIn()) {
                    showAdminScreen();
                } else {
                    document.getElementById('modal-admin-auth').classList.remove('hidden');
                }
            };
        }

        const btnCancelAuth = document.getElementById('btn-cancel-admin-auth');
        if (btnCancelAuth) {
            btnCancelAuth.onclick = () => document.getElementById('modal-admin-auth').classList.add('hidden');
        }

        const formAuth = document.getElementById('form-admin-auth');
        if (formAuth) {
            formAuth.onsubmit = (e) => {
                e.preventDefault();
                const pass = document.getElementById('admin-auth-pass').value.trim();
                if (FirebaseService.loginAdmin(pass)) {
                    document.getElementById('modal-admin-auth').classList.add('hidden');
                    document.getElementById('admin-auth-pass').value = '';
                    showAdminScreen();
                } else {
                    alert("Invalid passcode! (Demo passcode: admin123)");
                }
            };
        }

        const btnAdminLogout = document.getElementById('btn-admin-logout');
        if (btnAdminLogout) {
            btnAdminLogout.onclick = () => {
                FirebaseService.logoutAdmin();
                hideAdminScreen();
            };
        }

        const btnAdminExit = document.getElementById('btn-admin-exit');
        if (btnAdminExit) {
            btnAdminExit.onclick = hideAdminScreen;
        }

        // Tab Navigation
        document.querySelectorAll('[data-admin-tab]').forEach(btn => {
            btn.onclick = () => switchAdminTab(btn.getAttribute('data-admin-tab'));
        });

        // Question Editor Real-time KaTeX preview listener
        const qeContent = document.getElementById('qe-content');
        if (qeContent) {
            qeContent.addEventListener('input', () => updateQePreview());
        }

        const qeType = document.getElementById('qe-type');
        if (qeType) {
            qeType.addEventListener('change', (e) => {
                const optContainer = document.getElementById('qe-options-container');
                if (optContainer) optContainer.style.display = e.target.value === 'MCQ' ? 'block' : 'none';
            });
        }

        // Image URL live preview in question editor
        const qeImageUrl = document.getElementById('qe-image-url');
        if (qeImageUrl) {
            qeImageUrl.addEventListener('input', () => {
                const url = qeImageUrl.value.trim();
                const wrap = document.getElementById('qe-image-preview-wrap');
                const img  = document.getElementById('qe-image-preview');
                if (url && wrap && img) {
                    img.src = url;
                    wrap.classList.remove('hidden');
                } else if (wrap) {
                    wrap.classList.add('hidden');
                }
            });
        }

        // Modal triggers
        const btnCloseQe = document.getElementById('btn-close-qe');
        if (btnCloseQe) btnCloseQe.onclick = closeQuestionEditor;
        const btnCancelQe = document.getElementById('btn-cancel-qe');
        if (btnCancelQe) btnCancelQe.onclick = closeQuestionEditor;
        const btnSaveQe = document.getElementById('btn-save-qe');
        if (btnSaveQe) btnSaveQe.onclick = saveQuestionFromEditor;

        const btnAddQ = document.getElementById('btn-admin-add-question');
        if (btnAddQ) btnAddQ.onclick = () => openQuestionEditor(-1);

        const btnAddPaper = document.getElementById('btn-admin-add-paper');
        if (btnAddPaper) btnAddPaper.onclick = () => openPaperEditor(null);

        const btnEditPaper = document.getElementById('btn-admin-edit-paper');
        if (btnEditPaper) btnEditPaper.onclick = () => openPaperEditor(ADMIN_STATE.selectedPaperId);

        const btnDelPaper = document.getElementById('btn-admin-del-paper');
        if (btnDelPaper) {
            btnDelPaper.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                btnDelPaper.disabled = true;
                try {
                    await deleteSelectedPaper();
                } finally {
                    btnDelPaper.disabled = false;
                }
            };
        }

        const btnCancelPe = document.getElementById('btn-cancel-pe');
        if (btnCancelPe) btnCancelPe.onclick = () => document.getElementById('modal-paper-editor').classList.add('hidden');

        const formPe = document.getElementById('form-paper-editor');
        if (formPe) formPe.onsubmit = savePaperFromEditor;

        const peAccessMode = document.getElementById('pe-access-mode');
        if (peAccessMode) {
            peAccessMode.onchange = (e) => {
                const mode = e.target.value;
                document.getElementById('pe-pin-field').classList.toggle('hidden', mode !== 'PIN_PROTECTED');
                document.getElementById('pe-whitelist-field').classList.toggle('hidden', mode !== 'WHITELIST');
            };
        }

        // --- Google Sheets Paper Importer ---
        const btnImportSheet = document.getElementById('btn-admin-import-sheet');
        if (btnImportSheet) {
            btnImportSheet.onclick = openSheetImportModal;
        }

        const btnCloseSheet = document.getElementById('btn-close-sheet-import');
        if (btnCloseSheet) btnCloseSheet.onclick = () => document.getElementById('modal-sheet-import').classList.add('hidden');

        const btnCancelSheet = document.getElementById('btn-cancel-sheet-import');
        if (btnCancelSheet) btnCancelSheet.onclick = () => document.getElementById('modal-sheet-import').classList.add('hidden');

        const btnCopySheetTpl = document.getElementById('btn-copy-sheet-template');
        if (btnCopySheetTpl) btnCopySheetTpl.onclick = copySheetTemplate;

        const btnDlSheetTpl = document.getElementById('btn-dl-sheet-template');
        if (btnDlSheetTpl) btnDlSheetTpl.onclick = downloadSheetTemplateCSV;

        const btnParseSheet = document.getElementById('btn-parse-sheet');
        if (btnParseSheet) btnParseSheet.onclick = previewParsedSheet;

        const btnSaveSheet = document.getElementById('btn-save-sheet-import');
        if (btnSaveSheet) btnSaveSheet.onclick = saveSheetImport;

        // --- Google Sheets Student Whitelist Importer ---
        const btnImportStudents = document.getElementById('btn-admin-import-students');
        if (btnImportStudents) btnImportStudents.onclick = () => document.getElementById('modal-student-import').classList.remove('hidden');

        const btnCloseStudImp = document.getElementById('btn-close-student-import');
        if (btnCloseStudImp) btnCloseStudImp.onclick = () => document.getElementById('modal-student-import').classList.add('hidden');

        const btnCancelStudImp = document.getElementById('btn-cancel-student-import');
        if (btnCancelStudImp) btnCancelStudImp.onclick = () => document.getElementById('modal-student-import').classList.add('hidden');

        const btnCopyStudTpl = document.getElementById('btn-copy-student-template');
        if (btnCopyStudTpl) btnCopyStudTpl.onclick = copyStudentTemplate;

        const btnSaveStudImp = document.getElementById('btn-save-student-import');
        if (btnSaveStudImp) btnSaveStudImp.onclick = saveStudentImport;

        // Single student editor
        const btnAddStudent = document.getElementById('btn-admin-add-student');
        if (btnAddStudent) btnAddStudent.onclick = () => openStudentEditor();

        const btnCancelSt = document.getElementById('btn-cancel-st');
        if (btnCancelSt) btnCancelSt.onclick = () => document.getElementById('modal-student-editor').classList.add('hidden');

        const formSt = document.getElementById('form-student-editor');
        if (formSt) {
            formSt.onsubmit = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await saveSingleStudent();
            };
        }

        const btnSaveSingleSt = document.getElementById('btn-save-single-student');
        if (btnSaveSingleSt) {
            btnSaveSingleSt.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await saveSingleStudent();
            };
        }

        const btnClearStudents = document.getElementById('btn-clear-students');
        if (btnClearStudents) {
            btnClearStudents.onclick = async () => {
                if (confirm("Clear all authorized students in whitelist?")) {
                    localStorage.removeItem("jee_custom_students");
                    renderAdminStudents();
                }
            };
        }

        // Result Modifier Modal
        const btnCancelResEdit = document.getElementById('btn-cancel-res-edit');
        if (btnCancelResEdit) btnCancelResEdit.onclick = () => document.getElementById('modal-result-editor').classList.add('hidden');

        const formResEdit = document.getElementById('form-result-editor');
        if (formResEdit) formResEdit.onsubmit = saveModifiedResult;

        const btnCloseSubView = document.getElementById('btn-close-sub-view');
        if (btnCloseSubView) btnCloseSubView.onclick = () => document.getElementById('modal-submission-view').classList.add('hidden');

        const btnExportSubs = document.getElementById('btn-export-submissions');
        if (btnExportSubs) btnExportSubs.onclick = exportSubmissionsJSON;

        const btnClearVios = document.getElementById('btn-clear-violations');
        if (btnClearVios) btnClearVios.onclick = clearViolationsLog;

        const btnSeed = document.getElementById('btn-admin-seed');
        if (btnSeed) btnSeed.onclick = seedDefaultPapersToFirebase;

        const formFb = document.getElementById('form-firebase-config');
        if (formFb) formFb.onsubmit = saveFirebaseConfigForm;

        const btnResetLocal = document.getElementById('btn-admin-reset-local');
        if (btnResetLocal) {
            btnResetLocal.onclick = async () => {
                await FirebaseService.saveConfig({ apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: "" });
                updateFirebaseStatusBadges();
                alert("Reset to Local Fallback mode.");
            };
        }

        const btnSavePin = document.getElementById('btn-save-admin-pin');
        if (btnSavePin) {
            btnSavePin.onclick = () => {
                const pin = document.getElementById('admin-new-pin').value.trim();
                if (pin.length < 4) {
                    alert("Passcode must be at least 4 characters.");
                    return;
                }
                localStorage.setItem("jee_admin_pin", pin);
                document.getElementById('admin-new-pin').value = '';
                alert("Admin passcode updated successfully!");
            };
        }

        // Filter for questions subject
        const subjFilter = document.getElementById('admin-subject-filter');
        if (subjFilter) {
            subjFilter.onchange = () => renderAdminQuestionsTable();
        }

        const paperSelect = document.getElementById('admin-paper-select');
        if (paperSelect) {
            paperSelect.onchange = (e) => {
                ADMIN_STATE.selectedPaperId = parseInt(e.target.value);
                ADMIN_STATE.activePaperData = generatePaperByID(ADMIN_STATE.selectedPaperId);
                renderAdminQuestionsTable();
            };
        }

        updateFirebaseStatusBadges();
    }

    function updateFirebaseStatusBadges() {
        const isOnline = FirebaseService.isOnline();
        const cfg = FirebaseService.getConfig();
        const badge = document.getElementById('admin-fb-badge');
        const statusText = document.getElementById('admin-fb-status');
        const livePill = document.getElementById('fb-live-pill');
        const desc = document.getElementById('fb-status-desc');

        if (isOnline) {
            if (badge) { badge.className = "badge-online text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"; }
            if (statusText) statusText.innerText = "Firebase Connected";
            if (livePill) {
                livePill.className = "badge-online px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5";
                livePill.innerHTML = '<span class="w-2 h-2 rounded-full bg-current"></span> Connected (' + (cfg.projectId || 'Firestore') + ')';
            }
            if (desc) desc.innerText = "Live Cloud Firestore database is active and syncing real-time.";
        } else {
            if (badge) { badge.className = "badge-offline text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"; }
            if (statusText) statusText.innerText = "Local Fallback";
            if (livePill) {
                livePill.className = "badge-offline px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5";
                livePill.innerHTML = '<span class="w-2 h-2 rounded-full bg-current"></span> Offline / Local Fallback';
            }
            if (desc) desc.innerText = "Running with smart localStorage fallback. Enter your Firebase project keys below to connect.";
        }
    }

    function showAdminScreen() {
        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-exam').classList.add('hidden');
        document.getElementById('screen-instructions').classList.add('hidden');
        document.getElementById('screen-result').classList.add('hidden');
        document.getElementById('screen-admin').classList.remove('hidden');
        updateFirebaseStatusBadges();
        switchAdminTab(ADMIN_STATE.currentTab || 'overview');
    }

    function hideAdminScreen() {
        document.getElementById('screen-admin').classList.add('hidden');
        document.getElementById('screen-setup').classList.remove('hidden');
        renderPaperGrid();
    }

    function switchAdminTab(tabName) {
        ADMIN_STATE.currentTab = tabName;
        document.querySelectorAll('[data-admin-tab]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-admin-tab') === tabName);
        });

        const tabs = ['overview', 'papers', 'students', 'submissions', 'violations', 'settings'];
        tabs.forEach(t => {
            const view = document.getElementById(`admin-view-${t}`);
            if (view) view.classList.toggle('hidden', t !== tabName);
        });

        if (tabName === 'overview') renderAdminOverview();
        else if (tabName === 'papers') renderAdminPapers();
        else if (tabName === 'students') renderAdminStudents();
        else if (tabName === 'submissions') renderAdminSubmissions();
        else if (tabName === 'violations') renderAdminViolations();
        else if (tabName === 'settings') renderAdminSettings();
    }

    async function renderAdminOverview() {
        const subs = await FirebaseService.getSubmissions();
        const vios = await FirebaseService.getViolations();

        // Metrics
        const totalSubs = subs.length;
        let avgScore = 0;
        if (totalSubs > 0) {
            const sum = subs.reduce((acc, s) => acc + (Number(s.score) || 0), 0);
            avgScore = Math.round(sum / totalSubs);
        }

        document.getElementById('stat-total-subs').innerText = totalSubs;
        document.getElementById('stat-avg-score').innerHTML = `${avgScore} <span class="text-sm font-normal text-slate-400">/ 300</span>`;
        document.getElementById('stat-total-vios').innerText = vios.length;

        // Recent Submissions
        const recentSubsCont = document.getElementById('admin-recent-subs');
        if (recentSubsCont) {
            if (subs.length === 0) {
                recentSubsCont.innerHTML = '<div class="p-3 bg-slate-900/60 rounded-xl text-center text-slate-500">No test submissions yet.</div>';
            } else {
                recentSubsCont.innerHTML = subs.slice(0, 5).map(s => {
                    const timeStr = s.timestamp ? new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    return `
                    <div class="p-2.5 bg-slate-900/70 rounded-xl flex items-center justify-between border border-slate-800">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">U</div>
                            <div>
                                <div class="font-bold text-white">${s.candidateId || 'Candidate'} &bull; ${s.paperTitle || ('Paper ' + s.paperId)}</div>
                                <div class="text-[10px] text-slate-500">${timeStr} &bull; ${s.correct || 0} Correct, ${s.wrong || 0} Wrong</div>
                            </div>
                        </div>
                        <div class="font-mono font-bold text-sm ${s.score >= 0 ? 'text-emerald-400' : 'text-red-400'}">${s.score} / 300</div>
                    </div>`;
                }).join('');
            }
        }

        // Recent Violations
        const recentViosCont = document.getElementById('admin-recent-vios');
        if (recentViosCont) {
            if (vios.length === 0) {
                recentViosCont.innerHTML = '<div class="p-3 bg-slate-900/60 rounded-xl text-center text-slate-500">No security violations logged.</div>';
            } else {
                recentViosCont.innerHTML = vios.slice(0, 5).map(v => {
                    const timeStr = v.timestamp ? new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    return `
                    <div class="p-2.5 bg-slate-900/70 rounded-xl flex items-center justify-between border border-amber-500/15">
                        <div>
                            <div class="font-bold text-amber-300 text-xs">${v.violationType || 'Security Alert'}</div>
                            <div class="text-[10px] text-slate-500">${v.candidateId || 'Candidate'} &bull; ${timeStr}</div>
                        </div>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">Warning ${v.warningCount || 1}/3</span>
                    </div>`;
                }).join('');
            }
        }
    }

    function renderAdminPapers() {
        const select = document.getElementById('admin-paper-select');
        if (!select) return;

        const order = getPaperOrder();
        if (order.length === 0) {
            select.innerHTML = `<option value="">No papers available</option>`;
            ADMIN_STATE.activePaperData = null;
            const tbody = document.getElementById('admin-questions-tbody');
            if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500 text-xs">All papers have been deleted. Click "Add New Paper" or "Import from Google Sheets" to create papers.</td></tr>`;
            return;
        }

        if (!order.includes(ADMIN_STATE.selectedPaperId)) {
            ADMIN_STATE.selectedPaperId = order[0];
        }

        select.innerHTML = order.map(pid => `
            <option value="${pid}" ${pid === ADMIN_STATE.selectedPaperId ? 'selected' : ''}>Mock Paper ${pid}</option>
        `).join('');

        ADMIN_STATE.activePaperData = generatePaperByID(ADMIN_STATE.selectedPaperId);
        
        // Update access tag
        const accessTag = document.getElementById('admin-paper-access-tag');
        if (accessTag && ADMIN_STATE.activePaperData) {
            const mode = ADMIN_STATE.activePaperData.accessMode || "PUBLIC";
            accessTag.className = mode === 'PUBLIC' ? 'badge-access-public text-[10px] font-bold px-2 py-0.5 rounded-full'
                : mode === 'PIN_PROTECTED' ? 'badge-access-pin text-[10px] font-bold px-2 py-0.5 rounded-full'
                : 'badge-access-whitelist text-[10px] font-bold px-2 py-0.5 rounded-full';
            accessTag.innerText = mode;
        }

        renderAdminQuestionsTable();
    }

    function renderAdminQuestionsTable() {
        const tbody = document.getElementById('admin-questions-tbody');
        if (!tbody || !ADMIN_STATE.activePaperData) return;

        const filter = document.getElementById('admin-subject-filter')?.value || 'ALL';
        
        let allQuestions = [];
        let totalDurationSec = 0;

        ADMIN_STATE.activePaperData.sections.forEach(sec => {
            sec.questions.forEach((q, idx) => {
                const targetSec = q.timeLimitSec || (sec.name === 'Physics' ? 120 : sec.name === 'Chemistry' ? 90 : 150);
                totalDurationSec += targetSec;
                allQuestions.push({ ...q, sectionName: sec.name, globalIdx: allQuestions.length, inSecIdx: idx, timeLimitSec: targetSec });
            });
        });

        const calcDurationEl = document.getElementById('admin-calc-duration');
        if (calcDurationEl) {
            const mins = Math.ceil(totalDurationSec / 60);
            calcDurationEl.innerText = `Est. Duration: ${mins} mins (${totalDurationSec}s total)`;
        }

        if (filter !== 'ALL') {
            allQuestions = allQuestions.filter(q => q.sectionName === filter);
        }

        const countEl = document.getElementById('admin-question-count');
        if (countEl) countEl.innerText = allQuestions.length;

        const defaultPos = typeof ADMIN_STATE.activePaperData.marksCorrect === 'number' ? ADMIN_STATE.activePaperData.marksCorrect : 4;
        const defaultNeg = typeof ADMIN_STATE.activePaperData.marksNegative === 'number' ? ADMIN_STATE.activePaperData.marksNegative : -1;

        tbody.innerHTML = allQuestions.map((q, idx) => {
            const truncContent = q.content.replace(/<[^>]*>?/gm, '').substring(0, 60);
            const qPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
            const qNeg = typeof q.marksNegative === 'number' ? q.marksNegative : defaultNeg;
            const imgUrl = q.imageUrl || q.image;
            const imageCell = imgUrl 
                ? `<a href="${imgUrl}" target="_blank" class="inline-flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20" title="View Question Image"><i class="fas fa-image"></i> View</a>` 
                : `<span class="text-slate-600 text-xs">—</span>`;

            return `
            <tr>
                <td class="font-mono text-slate-400 font-bold">${idx + 1}</td>
                <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${q.sectionName === 'Physics' ? 'bg-blue-500/15 text-blue-400' : q.sectionName === 'Chemistry' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-purple-500/15 text-purple-400'}">${q.sectionName}</span></td>
                <td><span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">${q.type}</span></td>
                <td class="text-slate-200 text-xs">${truncContent}${q.content.length > 60 ? '…' : ''}</td>
                <td>${imageCell}</td>
                <td><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 font-mono">+${qPos} / ${qNeg}</span></td>
                <td class="font-mono text-xs text-sky-400">${q.timeLimitSec}s</td>
                <td class="font-mono text-xs text-amber-300 font-semibold truncate max-w-[120px]">${q.options && q.answerHash ? '(Encoded Option)' : (q.answer || '—')}</td>
                <td class="text-right whitespace-nowrap">
                    <button class="btn-edit-q text-blue-400 hover:text-blue-300 px-1.5 py-1" data-q-idx="${q.globalIdx}" title="Edit Question"><i class="fas fa-edit"></i></button>
                    <button class="btn-del-q text-red-400 hover:text-red-300 px-1.5 py-1" data-q-idx="${q.globalIdx}" title="Delete Question"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('.btn-edit-q').forEach(btn => {
            btn.onclick = () => openQuestionEditor(parseInt(btn.getAttribute('data-q-idx')));
        });
        tbody.querySelectorAll('.btn-del-q').forEach(btn => {
            btn.onclick = () => deleteQuestionFromPaper(parseInt(btn.getAttribute('data-q-idx')));
        });
    }

    function openQuestionEditor(qIdx) {
        ADMIN_STATE.editingQuestionIdx = qIdx;
        const modal = document.getElementById('modal-question-editor');
        const title = document.getElementById('qe-modal-title');
        
        let q = null;
        if (qIdx >= 0 && ADMIN_STATE.activePaperData) {
            let count = 0;
            for (const sec of ADMIN_STATE.activePaperData.sections) {
                for (const quest of sec.questions) {
                    if (count === qIdx) { q = { ...quest, sectionName: sec.name }; break; }
                    count++;
                }
                if (q) break;
            }
        }

        if (q) {
            title.innerText = `Edit Question #${qIdx + 1}`;
            document.getElementById('qe-subject').value = q.sectionName || 'Physics';
            document.getElementById('qe-type').value = q.type || 'MCQ';
            document.getElementById('qe-section').value = q.section || 'Section A';
            document.getElementById('qe-time-sec').value = q.timeLimitSec || 120;
            document.getElementById('qe-content').value = q.content || '';
            document.getElementById('qe-answer').value = q.answer || (q.options ? q.options[0] : '');
            
            // Marks & Image
            const defaultPos = ADMIN_STATE.activePaperData?.marksCorrect ?? 4;
            const defaultNeg = ADMIN_STATE.activePaperData?.marksNegative ?? -1;
            document.getElementById('qe-marks-correct').value = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
            document.getElementById('qe-marks-negative').value = typeof q.marksNegative === 'number' ? q.marksNegative : defaultNeg;
            
            const imgUrl = q.imageUrl || q.image || '';
            document.getElementById('qe-image-url').value = imgUrl;
            const previewWrap = document.getElementById('qe-image-preview-wrap');
            const previewImg = document.getElementById('qe-image-preview');
            if (imgUrl && previewWrap && previewImg) {
                previewImg.src = imgUrl;
                previewWrap.classList.remove('hidden');
            } else if (previewWrap) {
                previewWrap.classList.add('hidden');
            }

            const optCont = document.getElementById('qe-options-container');
            if (optCont) optCont.style.display = q.type === 'MCQ' ? 'block' : 'none';

            if (q.options && q.options.length) {
                q.options.forEach((opt, i) => {
                    const el = document.getElementById(`qe-opt-${i}`);
                    if (el) el.value = opt || '';
                });
            }
        } else {
            title.innerText = "Add New Question";
            document.getElementById('qe-subject').value = 'Physics';
            document.getElementById('qe-type').value = 'MCQ';
            document.getElementById('qe-section').value = 'Section A';
            document.getElementById('qe-time-sec').value = 120;
            document.getElementById('qe-content').value = '';
            document.getElementById('qe-answer').value = '';
            document.getElementById('qe-marks-correct').value = ADMIN_STATE.activePaperData?.marksCorrect ?? 4;
            document.getElementById('qe-marks-negative').value = ADMIN_STATE.activePaperData?.marksNegative ?? -1;
            document.getElementById('qe-image-url').value = '';
            const previewWrap = document.getElementById('qe-image-preview-wrap');
            if (previewWrap) previewWrap.classList.add('hidden');

            for (let i = 0; i < 4; i++) {
                const el = document.getElementById(`qe-opt-${i}`);
                if (el) el.value = `Option ${String.fromCharCode(65 + i)}`;
            }
            const optCont = document.getElementById('qe-options-container');
            if (optCont) optCont.style.display = 'block';
        }

        updateQePreview();
        modal.classList.remove('hidden');
    }

    function updateQePreview() {
        const box = document.getElementById('qe-preview-box');
        const content = document.getElementById('qe-content')?.value || '';
        if (!box) return;

        box.innerHTML = content || '<span class="text-slate-500 italic">No content typed yet...</span>';
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(box, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                ],
                throwOnError: false
            });
        }
    }

    function closeQuestionEditor() {
        document.getElementById('modal-question-editor').classList.add('hidden');
    }

    async function saveQuestionFromEditor() {
        const subject = document.getElementById('qe-subject').value;
        const type = document.getElementById('qe-type').value;
        const section = document.getElementById('qe-section').value;
        const timeSec = parseInt(document.getElementById('qe-time-sec').value) || 120;
        const content = document.getElementById('qe-content').value.trim();
        const answer = document.getElementById('qe-answer').value.trim();
        const marksCorrect = parseFloat(document.getElementById('qe-marks-correct').value) || 4;
        const marksNegative = parseFloat(document.getElementById('qe-marks-negative').value) || -1;
        const imageUrl = document.getElementById('qe-image-url').value.trim();

        if (!content) { alert("Question content cannot be empty."); return; }
        if (!answer) { alert("Please provide a correct answer."); return; }

        let options = [];
        if (type === 'MCQ') {
            for (let i = 0; i < 4; i++) {
                const optVal = document.getElementById(`qe-opt-${i}`)?.value.trim();
                if (optVal) options.push(optVal);
            }
            if (options.length < 2) { alert("MCQ questions require at least 2 options."); return; }
        }

        let paper = ADMIN_STATE.activePaperData || generatePaperByID(ADMIN_STATE.selectedPaperId);
        let targetSec = paper.sections.find(s => s.name === subject);
        if (!targetSec) {
            targetSec = { name: subject, questions: [] };
            paper.sections.push(targetSec);
        }

        const newQ = {
            id: `${subject.substring(0, 3)}_p${paper.id}_q${Date.now()}`,
            type: type,
            section: section,
            timeLimitSec: timeSec,
            content: content,
            options: options,
            answer: answer,
            answerHash: obfuscate(answer),
            marksCorrect: marksCorrect,
            marksNegative: marksNegative,
            imageUrl: imageUrl,
            image: imageUrl
        };

        if (ADMIN_STATE.editingQuestionIdx >= 0) {
            let count = 0;
            for (const sec of paper.sections) {
                for (let i = 0; i < sec.questions.length; i++) {
                    if (count === ADMIN_STATE.editingQuestionIdx) {
                        sec.questions[i] = newQ;
                        break;
                    }
                    count++;
                }
            }
        } else {
            targetSec.questions.push(newQ);
        }

        await FirebaseService.savePaper(paper);
        ADMIN_STATE.activePaperData = paper;
        closeQuestionEditor();
        renderAdminQuestionsTable();
        alert("Question saved successfully!");
    }

    async function deleteQuestionFromPaper(qIdx) {
        if (!confirm("Are you sure you want to delete this question?")) return;
        const paper = ADMIN_STATE.activePaperData;
        if (!paper) return;

        let count = 0, found = false;
        for (const sec of paper.sections) {
            for (let i = 0; i < sec.questions.length; i++) {
                if (count === qIdx) {
                    sec.questions.splice(i, 1);
                    found = true;
                    break;
                }
                count++;
            }
            if (found) break;
        }

        await FirebaseService.savePaper(paper);
        renderAdminQuestionsTable();
    }

    function openPaperEditor(paperId) {
        const modal = document.getElementById('modal-paper-editor');
        const title = document.getElementById('pe-modal-title');
        
        if (paperId) {
            const paper = generatePaperByID(paperId);
            title.innerText = `Edit Paper #${paperId} Settings & Access`;
            document.getElementById('pe-paper-id').value = paperId;
            document.getElementById('pe-title').value = paper.title || `JEE Mock Paper ${paperId}`;
            document.getElementById('pe-duration').value = paper.durationMinutes || 180;
            document.getElementById('pe-num-id').value = paperId;
            document.getElementById('pe-num-id').disabled = true;
            document.getElementById('pe-marks-correct').value = typeof paper.marksCorrect === 'number' ? paper.marksCorrect : 4;
            document.getElementById('pe-marks-negative').value = typeof paper.marksNegative === 'number' ? paper.marksNegative : -1;

            const mode = paper.accessMode || "PUBLIC";
            document.getElementById('pe-access-mode').value = mode;
            document.getElementById('pe-access-pin').value = paper.accessPin || "";
            document.getElementById('pe-whitelist-ids').value = (paper.allowedCandidates || []).join(', ');
            document.getElementById('pe-pin-field').classList.toggle('hidden', mode !== 'PIN_PROTECTED');
            document.getElementById('pe-whitelist-field').classList.toggle('hidden', mode !== 'WHITELIST');
        } else {
            title.innerText = "Create New Mock Paper";
            document.getElementById('pe-paper-id').value = '';
            document.getElementById('pe-title').value = 'JEE Advanced Mock Test';
            document.getElementById('pe-duration').value = 180;
            document.getElementById('pe-num-id').value = 11;
            document.getElementById('pe-num-id').disabled = false;
            document.getElementById('pe-marks-correct').value = 4;
            document.getElementById('pe-marks-negative').value = -1;
            document.getElementById('pe-access-mode').value = "PUBLIC";
            document.getElementById('pe-access-pin').value = "";
            document.getElementById('pe-whitelist-ids').value = "";
            document.getElementById('pe-pin-field').classList.add('hidden');
            document.getElementById('pe-whitelist-field').classList.add('hidden');
        }
        modal.classList.remove('hidden');
    }

    async function savePaperFromEditor(e) {
        e.preventDefault();
        const paperId = parseInt(document.getElementById('pe-num-id').value);
        const title = document.getElementById('pe-title').value.trim();
        const duration = parseInt(document.getElementById('pe-duration').value);
        const marksCorrect = parseFloat(document.getElementById('pe-marks-correct').value) || 4;
        const marksNegative = parseFloat(document.getElementById('pe-marks-negative').value) || -1;
        const accessMode = document.getElementById('pe-access-mode').value;
        const accessPin = document.getElementById('pe-access-pin').value.trim();
        const whitelistRaw = document.getElementById('pe-whitelist-ids').value.trim();
        const allowedCandidates = whitelistRaw ? whitelistRaw.split(',').map(x => x.trim().toUpperCase()).filter(Boolean) : [];

        let paper = generatePaperByID(paperId);
        paper.id = paperId;
        paper.title = title;
        paper.durationMinutes = duration;
        paper.marksCorrect = marksCorrect;
        paper.marksNegative = marksNegative;
        paper.accessMode = accessMode;
        paper.accessPin = accessPin;
        paper.allowedCandidates = allowedCandidates;

        await FirebaseService.savePaper(paper);
        document.getElementById('modal-paper-editor').classList.add('hidden');
        renderAdminPapers();
        alert(`Paper #${paperId} saved successfully!`);
    }

    async function deleteSelectedPaper() {
        // Always read from the select element directly in case ADMIN_STATE is stale
        const selectEl = document.getElementById('admin-paper-select');
        const paperId = selectEl ? parseInt(selectEl.value) : ADMIN_STATE.selectedPaperId;
        
        if (!paperId || isNaN(paperId)) {
            alert("No paper selected to delete. Please select a paper first.");
            return;
        }

        if (!confirm(`Are you sure you want to DELETE Mock Paper ${paperId}?\nThis cannot be undone.`)) return;

        // Update ADMIN_STATE to match
        ADMIN_STATE.selectedPaperId = paperId;

        try {
            await FirebaseService.deletePaper(paperId);
        } catch(err) {
            console.error("Error deleting paper:", err);
            alert("Error deleting paper. Please try again.");
            return;
        }
        
        // Pick next available paper after deletion
        const remaining = getPaperOrder();
        ADMIN_STATE.selectedPaperId = remaining.length > 0 ? remaining[0] : null;
        ADMIN_STATE.activePaperData = ADMIN_STATE.selectedPaperId ? generatePaperByID(ADMIN_STATE.selectedPaperId) : null;
        
        renderAdminPapers();
        renderPaperGrid();
        alert(`Mock Paper #${paperId} has been successfully deleted!`);
    }

    // --- Google Sheets & CSV Paper Import Controller ---
    function openSheetImportModal() {
        document.getElementById('sheet-target-paper-id').value = ADMIN_STATE.selectedPaperId || 1;
        document.getElementById('sheet-target-title').value = `JEE Mock Paper ${ADMIN_STATE.selectedPaperId || 1} (Imported)`;
        document.getElementById('sheet-paste-area').value = '';
        document.getElementById('sheet-parse-status').classList.add('hidden');
        document.getElementById('modal-sheet-import').classList.remove('hidden');
    }

    function copySheetTemplate() {
        const sample = `Subject\tType\tSection\tQuestion\tOptionA\tOptionB\tOptionC\tOptionD\tCorrectAnswer\tTimeSeconds\tImageURL\tMarksCorrect\tMarksNegative
Physics\tMCQ\tSection A\tIf force $F = ma$, what is the dimension of force?\t$[MLT^{-2}]$\t$[MLT^{-1}]$\t$[ML^2T^{-2}]$\t$[M^0LT^{-2}]$\t$[MLT^{-2}]\t120\thttps://i.imgur.com/example.png\t4\t-1
Physics\tNUMERICAL\tSection B\tCalculate value of $\\int_0^2 x^2 dx$ to nearest integer.\t\t\t\t\t3\t150\t\t4\t-1
Chemistry\tMCQ\tSection A\tWhich of the following has highest electronegativity?\tFluorine\tChlorine\tBromine\tIodine\tFluorine\t90\t\t4\t-1
Mathematics\tMCQ\tSection A\tFind roots of $x^2 - 5x + 6 = 0$.\t$x=2, 3$\t$x=1, 6$\t$x=-2, -3$\t$x=0, 5$\t$x=2, 3$\t150\t\t4\t-1`;
        
        navigator.clipboard.writeText(sample).then(() => {
            alert("Sample Google Sheets template copied to clipboard! Paste it in Google Sheets or the textarea below.");
        });
    }

    function downloadSheetTemplateCSV() {
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
`Subject,Type,Section,Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,TimeSeconds,ImageURL,MarksCorrect,MarksNegative
Physics,MCQ,Section A,"If force F=ma, what is the dimension of force?","[MLT^-2]","[MLT^-1]","[ML^2T^-2]","[M^0LT^-2]","[MLT^-2]",120,https://i.imgur.com/example.png,4,-1
Physics,NUMERICAL,Section B,"Calculate value of integral_0^2 x^2 dx to nearest integer.",,,,,3,150,,4,-1
Chemistry,MCQ,Section A,"Which has highest electronegativity?",Fluorine,Chlorine,Bromine,Iodine,Fluorine,90,,4,-1
Mathematics,MCQ,Section A,"Find roots of x^2 - 5x + 6 = 0.","x=2, 3","x=1, 6","x=-2, -3","x=0, 5","x=2, 3",150,,4,-1`
        );
        const a = document.createElement('a');
        a.href = csvContent;
        a.download = "jee_mock_paper_template.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function parseSheetText(rawText) {
        const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return [];

        // Detect delimiter (Tab or Comma or Semicolon)
        const firstLine = lines[0];
        let delimiter = '\t';
        if (firstLine.includes('\t')) delimiter = '\t';
        else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';
        else if (firstLine.includes(',')) delimiter = ',';

        const hasHeader = firstLine.toLowerCase().includes('subject') || firstLine.toLowerCase().includes('question');
        const dataLines = hasHeader ? lines.slice(1) : lines;

        const parsedQuestions = [];
        dataLines.forEach((line, i) => {
            // Simple split handling quotes if CSV
            let cols = [];
            if (delimiter === ',') {
                const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
                let match;
                while ((match = regex.exec(line)) !== null && cols.length < 16) {
                    let val = match[1] || '';
                    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/""/g, '"');
                    cols.push(val.trim());
                    if (regex.lastIndex >= line.length) break;
                }
            } else {
                cols = line.split(delimiter).map(c => c.trim());
            }

            if (cols.length >= 4) {
                const subject = cols[0] || 'Physics';
                const type = (cols[1] || 'MCQ').toUpperCase().includes('NUM') ? 'NUMERICAL' : 'MCQ';
                const section = cols[2] || (type === 'MCQ' ? 'Section A' : 'Section B');
                const content = cols[3] || '';
                
                let options = [];
                let answer = '';
                let timeSec = 120;

                if (type === 'MCQ') {
                    options = [cols[4] || 'A', cols[5] || 'B', cols[6] || 'C', cols[7] || 'D'];
                    answer = cols[8] || options[0];
                    timeSec = parseInt(cols[9]) || (subject === 'Physics' ? 120 : subject === 'Chemistry' ? 90 : 150);
                } else {
                    answer = cols[8] || cols[4] || '0';
                    timeSec = parseInt(cols[9]) || (subject === 'Physics' ? 150 : subject === 'Chemistry' ? 120 : 180);
                }

                const imageUrl = cols[10] || '';
                const marksCorrect = (cols[11] !== undefined && cols[11] !== '') ? (parseFloat(cols[11]) || 4) : 4;
                const marksNegative = (cols[12] !== undefined && cols[12] !== '') ? (parseFloat(cols[12]) || -1) : -1;

                if (content) {
                    parsedQuestions.push({
                        id: `${subject.substring(0, 3)}_imp_q${i + 1}`,
                        subject: subject,
                        type: type,
                        section: section,
                        content: content,
                        options: options,
                        answer: answer,
                        answerHash: obfuscate(answer),
                        timeLimitSec: timeSec,
                        imageUrl: imageUrl,
                        image: imageUrl,
                        marksCorrect: marksCorrect,
                        marksNegative: marksNegative
                    });
                }
            }
        });

        return parsedQuestions;
    }

    function previewParsedSheet() {
        const raw = document.getElementById('sheet-paste-area').value.trim();
        const statusBox = document.getElementById('sheet-parse-status');
        if (!raw) {
            statusBox.className = "p-3 rounded-xl text-xs font-medium bg-red-950/50 border border-red-800 text-red-300";
            statusBox.innerText = "Please paste rows from your Google Sheet or CSV first.";
            statusBox.classList.remove('hidden');
            return;
        }

        const questions = parseSheetText(raw);
        if (questions.length === 0) {
            statusBox.className = "p-3 rounded-xl text-xs font-medium bg-amber-950/50 border border-amber-800 text-amber-300";
            statusBox.innerText = "No valid questions detected. Ensure your columns match: Subject, Type, Section, Question, OptionA, OptionB, OptionC, OptionD, Answer, TimeSeconds.";
            statusBox.classList.remove('hidden');
            return;
        }

        const phyCount = questions.filter(q => q.subject === 'Physics').length;
        const chemCount = questions.filter(q => q.subject === 'Chemistry').length;
        const mathCount = questions.filter(q => q.subject === 'Mathematics' || q.subject === 'Maths').length;
        const totalSec = questions.reduce((sum, q) => sum + q.timeLimitSec, 0);
        const estMins = Math.ceil(totalSec / 60);

        statusBox.className = "p-3 rounded-xl text-xs font-medium bg-emerald-950/50 border border-emerald-800 text-emerald-300";
        statusBox.innerHTML = `<strong>Valid Structure:</strong> Successfully parsed <strong>${questions.length} questions</strong> (${phyCount} Physics, ${chemCount} Chemistry, ${mathCount} Mathematics). Total estimated duration: <strong>${estMins} minutes</strong>. Ready to import!`;
        statusBox.classList.remove('hidden');
    }

    async function saveSheetImport() {
        const raw = document.getElementById('sheet-paste-area').value.trim();
        const paperId = parseInt(document.getElementById('sheet-target-paper-id').value) || 1;
        const paperTitle = document.getElementById('sheet-target-title').value.trim() || `JEE Mock Paper ${paperId}`;
        const questions = parseSheetText(raw);

        if (questions.length === 0) {
            alert("No questions to import. Please check your pasted data.");
            return;
        }

        const totalSec = questions.reduce((sum, q) => sum + q.timeLimitSec, 0);
        const durationMins = Math.max(10, Math.ceil(totalSec / 60));

        const sections = [
            { name: "Physics", questions: questions.filter(q => q.subject.toLowerCase().includes('phys')) },
            { name: "Chemistry", questions: questions.filter(q => q.subject.toLowerCase().includes('chem')) },
            { name: "Mathematics", questions: questions.filter(q => q.subject.toLowerCase().includes('math')) }
        ].filter(s => s.questions.length > 0);

        const newPaper = {
            id: paperId,
            title: paperTitle,
            durationMinutes: durationMins,
            accessMode: "PUBLIC",
            sections: sections
        };

        await FirebaseService.savePaper(newPaper);
        document.getElementById('modal-sheet-import').classList.add('hidden');
        ADMIN_STATE.selectedPaperId = paperId;
        ADMIN_STATE.activePaperData = newPaper;
        renderAdminPapers();
        alert(`Successfully imported ${questions.length} questions into Paper #${paperId} with duration ${durationMins} minutes!`);
    }

    // --- Google Sheets & CSV Student Whitelist Import Controller ---
    function copyStudentTemplate() {
        const sample = `CandidateID\tCandidateName\tAllowedPapers\tBatch\tEmail
JEE2026-001\tRahul Sharma\tALL\tBatch-A\trahul@example.com
JEE2026-002\tPriya Patel\t1,2,3\tBatch-A\tpriya@example.com
JEE2026-003\tAmit Verma\t1\tBatch-B\tamit@example.com`;
        navigator.clipboard.writeText(sample).then(() => {
            alert("Sample Student Whitelist template copied to clipboard!");
        });
    }

    function parseStudentText(rawText) {
        const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return [];

        const firstLine = lines[0];
        let delimiter = '\t';
        if (firstLine.includes('\t')) delimiter = '\t';
        else if (firstLine.includes(',')) delimiter = ',';

        const hasHeader = firstLine.toLowerCase().includes('candidate') || firstLine.toLowerCase().includes('roll');
        const dataLines = hasHeader ? lines.slice(1) : lines;

        const students = [];
        dataLines.forEach(line => {
            const cols = line.split(delimiter).map(c => c.trim());
            if (cols.length >= 1 && cols[0]) {
                students.push({
                    candidateId: cols[0].toUpperCase(),
                    name: cols[1] || 'Student',
                    allowedPapers: cols[2] || 'ALL',
                    batch: cols[3] || 'General',
                    email: cols[4] || ''
                });
            }
        });

        return students;
    }

    async function saveStudentImport() {
        const raw = document.getElementById('student-paste-area').value.trim();
        const students = parseStudentText(raw);

        if (students.length === 0) {
            alert("No candidate rows detected.");
            return;
        }

        await FirebaseService.saveStudents(students);
        document.getElementById('modal-student-import').classList.add('hidden');
        renderAdminStudents();
        alert(`Successfully imported ${students.length} authorized students to whitelist!`);
    }

    function openStudentEditor() {
        document.getElementById('st-candidate-id').value = '';
        document.getElementById('st-name').value = '';
        document.getElementById('st-papers').value = 'ALL';
        document.getElementById('st-batch').value = 'Batch A';
        document.getElementById('st-email').value = '';
        document.getElementById('modal-student-editor').classList.remove('hidden');
    }

    async function saveSingleStudent() {
        const candIdInput = document.getElementById('st-candidate-id');
        const candId = candIdInput ? candIdInput.value.trim().toUpperCase() : '';
        const name = (document.getElementById('st-name')?.value || '').trim() || 'Student';
        const papers = (document.getElementById('st-papers')?.value || '').trim() || 'ALL';
        const batch = (document.getElementById('st-batch')?.value || '').trim() || 'General';
        const email = (document.getElementById('st-email')?.value || '').trim();

        if (!candId) {
            alert("Please enter a Candidate Roll Number / ID.");
            if (candIdInput) candIdInput.focus();
            return;
        }

        const btn = document.getElementById('btn-save-single-student');
        if (btn) { btn.disabled = true; btn.innerText = 'Saving...'; }

        try {
            await FirebaseService.saveStudents([{
                candidateId: candId,
                name: name,
                allowedPapers: papers,
                batch: batch,
                email: email
            }]);

            const modal = document.getElementById('modal-student-editor');
            if (modal) modal.classList.add('hidden');
            await renderAdminStudents();
            alert('Student "' + candId + '" saved to whitelist successfully!');
        } catch(err) {
            console.error('Error saving student:', err);
            alert('Error saving student. Please try again.');
        } finally {
            if (btn) { btn.disabled = false; btn.innerText = 'Save Student'; }
        }
    }

    async function renderAdminStudents() {
        const tbody = document.getElementById('admin-students-tbody');
        if (!tbody) return;

        const students = await FirebaseService.getStudents();
        const countEl = document.getElementById('admin-student-count');
        if (countEl) countEl.innerText = students.length;

        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-500 text-xs">No authorized candidates registered yet. Click "Import Students Sheet" or "Add Student".</td></tr>`;
            return;
        }

        tbody.innerHTML = students.map(st => `
            <tr>
                <td class="font-bold text-white font-mono">${st.candidateId}</td>
                <td class="text-slate-200 text-xs">${st.name || '—'}</td>
                <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${st.allowedPapers === 'ALL' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-purple-500/15 text-purple-400'}">${st.allowedPapers || 'ALL'}</span></td>
                <td class="text-slate-400 text-xs">${st.batch || '—'}</td>
                <td class="text-slate-400 text-xs">${st.email || '—'}</td>
                <td class="text-right">
                    <button class="btn-del-student text-red-400 hover:text-red-300 px-2 py-1 text-xs" data-cand-id="${st.candidateId}" title="Remove Access"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.btn-del-student').forEach(btn => {
            btn.onclick = async () => {
                const cid = btn.getAttribute('data-cand-id');
                if (confirm(`Remove candidate "${cid}" from whitelist?`)) {
                    await FirebaseService.deleteStudent(cid);
                    renderAdminStudents();
                }
            };
        });
    }

    // --- Submissions & Results Modification Controller ---
    async function renderAdminSubmissions() {
        const tbody = document.getElementById('admin-submissions-tbody');
        if (!tbody) return;

        const subs = await FirebaseService.getSubmissions();
        if (subs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500 text-xs">No exam submissions recorded yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = subs.map(s => {
            const dateStr = s.timestamp ? new Date(s.timestamp).toLocaleString() : 'N/A';
            return `
            <tr>
                <td class="font-bold text-white flex items-center gap-1.5"><i class="fas fa-user-circle text-blue-400"></i> ${s.candidateId || 'Candidate'}</td>
                <td class="text-slate-300 text-xs">${s.paperTitle || ('Paper ' + s.paperId)}</td>
                <td class="font-mono font-bold text-sm ${s.score >= 0 ? 'text-emerald-400' : 'text-red-400'}">${s.score} / ${s.maxScore || 300}</td>
                <td class="text-emerald-400 font-bold text-xs">${s.correct || 0}</td>
                <td class="text-red-400 font-bold text-xs">${s.wrong || 0}</td>
                <td class="text-slate-400 text-xs">${dateStr}</td>
                <td class="text-right whitespace-nowrap">
                    <button class="btn-view-sub text-blue-400 hover:text-blue-300 text-xs font-semibold px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20 mr-1" data-sub-id="${s.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit-sub text-amber-400 hover:text-amber-300 text-xs font-semibold px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20 mr-1" data-sub-id="${s.id}" title="Modify Result">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-del-sub text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20" data-sub-id="${s.id}" title="Delete Result">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('.btn-view-sub').forEach(btn => {
            btn.onclick = () => viewSubmissionDetails(btn.getAttribute('data-sub-id'));
        });
        tbody.querySelectorAll('.btn-edit-sub').forEach(btn => {
            btn.onclick = () => openResultEditor(btn.getAttribute('data-sub-id'));
        });
        tbody.querySelectorAll('.btn-del-sub').forEach(btn => {
            btn.onclick = () => deleteSubmissionRecord(btn.getAttribute('data-sub-id'));
        });
    }

    async function openResultEditor(subId) {
        const subs = await FirebaseService.getSubmissions();
        const sub = subs.find(s => s.id === subId);
        if (!sub) return;

        document.getElementById('res-edit-id').value = subId;
        document.getElementById('res-edit-candidate').value = `${sub.candidateId || 'JEEPREMIUM'} • ${sub.paperTitle || ('Paper ' + sub.paperId)}`;
        document.getElementById('res-edit-score').value = sub.score !== undefined ? sub.score : 0;
        document.getElementById('res-edit-correct').value = sub.correct !== undefined ? sub.correct : 0;
        document.getElementById('res-edit-wrong').value = sub.wrong !== undefined ? sub.wrong : 0;
        document.getElementById('res-edit-notes').value = sub.adminNotes || '';

        document.getElementById('modal-result-editor').classList.remove('hidden');
    }

    async function saveModifiedResult(e) {
        e.preventDefault();
        const subId = document.getElementById('res-edit-id').value;
        const score = parseInt(document.getElementById('res-edit-score').value) || 0;
        const correct = parseInt(document.getElementById('res-edit-correct').value) || 0;
        const wrong = parseInt(document.getElementById('res-edit-wrong').value) || 0;
        const notes = document.getElementById('res-edit-notes').value.trim();

        await FirebaseService.updateSubmission(subId, {
            score: score,
            correct: correct,
            wrong: wrong,
            adminNotes: notes
        });

        document.getElementById('modal-result-editor').classList.add('hidden');
        renderAdminSubmissions();
        alert("Result modified and updated successfully in Firestore!");
    }

    async function deleteSubmissionRecord(subId) {
        if (!confirm("Are you sure you want to DELETE this student submission record?")) return;
        await FirebaseService.deleteSubmission(subId);
        renderAdminSubmissions();
    }

    async function viewSubmissionDetails(subId) {
        const subs = await FirebaseService.getSubmissions();
        const sub = subs.find(s => s.id === subId);
        if (!sub) return;

        document.getElementById('sub-view-candidate').innerText = `Candidate: ${sub.candidateId || 'JEEPREMIUM'}`;
        document.getElementById('sub-view-meta').innerText = `${sub.paperTitle || 'Mock Exam'} • Score: ${sub.score}/${sub.maxScore || 300} • ${sub.correct || 0} Correct, ${sub.wrong || 0} Incorrect`;

        const cont = document.getElementById('sub-view-answers');
        if (cont && sub.answers) {
            const keys = Object.keys(sub.answers);
            if (keys.length === 0) {
                cont.innerHTML = '<p class="text-slate-500 italic">No answers recorded.</p>';
            } else {
                cont.innerHTML = keys.map((qId, i) => {
                    const ans = sub.answers[qId];
                    const val = ans.value !== null && ans.value !== '' ? ans.value : 'Skipped';
                    const timeSpent = ans.timeSpentSec ? `Time spent: ${ans.timeSpentSec}s` : '';
                    return `
                    <div class="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                        <div>
                            <span class="font-bold text-white">Q${i + 1} (${qId})</span>
                            <span class="text-slate-400 ml-2">Marked: <strong class="text-blue-400 font-mono">${val}</strong></span>
                            ${timeSpent ? `<span class="text-sky-400 text-[10px] ml-2 font-mono">(${timeSpent})</span>` : ''}
                        </div>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${ans.status.includes('answered') ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}">${ans.status}</span>
                    </div>`;
                }).join('');
            }
        }

        document.getElementById('modal-submission-view').classList.remove('hidden');
    }

    async function exportSubmissionsJSON() {
        const subs = await FirebaseService.getSubmissions();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subs, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", `jee_exam_submissions_${Date.now()}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    async function renderAdminViolations() {
        const tbody = document.getElementById('admin-violations-tbody');
        if (!tbody) return;

        const vios = await FirebaseService.getViolations();
        if (vios.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500 text-xs">No proctoring violations recorded. Clean session record!</td></tr>`;
            return;
        }

        tbody.innerHTML = vios.map(v => {
            const dateStr = v.timestamp ? new Date(v.timestamp).toLocaleString() : 'N/A';
            return `
            <tr>
                <td class="text-slate-400 text-xs">${dateStr}</td>
                <td class="font-bold text-white">${v.candidateId || 'Candidate'}</td>
                <td class="text-slate-300 text-xs">${v.paperTitle || ('Paper ' + v.paperId)}</td>
                <td class="text-amber-400 font-bold text-xs"><i class="fas fa-exclamation-circle mr-1"></i> ${v.violationType || 'Focus Lost'}</td>
                <td><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">Warning ${v.warningCount || 1}/3</span></td>
            </tr>`;
        }).join('');
    }

    function clearViolationsLog() {
        if (!confirm("Clear all security incident logs?")) return;
        localStorage.removeItem("jee_custom_violations");
        renderAdminViolations();
    }

    function renderAdminSettings() {
        const cfg = FirebaseService.getConfig();
        document.getElementById('fb-cfg-project').value = cfg.projectId || '';
        document.getElementById('fb-cfg-key').value = cfg.apiKey || '';
        document.getElementById('fb-cfg-auth').value = cfg.authDomain || '';
        document.getElementById('fb-cfg-bucket').value = cfg.storageBucket || '';
        document.getElementById('fb-cfg-sender').value = cfg.messagingSenderId || '';
        document.getElementById('fb-cfg-app').value = cfg.appId || '';
        updateFirebaseStatusBadges();
    }

    async function saveFirebaseConfigForm(e) {
        e.preventDefault();
        const newCfg = {
            projectId: document.getElementById('fb-cfg-project').value.trim(),
            apiKey: document.getElementById('fb-cfg-key').value.trim(),
            authDomain: document.getElementById('fb-cfg-auth').value.trim(),
            storageBucket: document.getElementById('fb-cfg-bucket').value.trim(),
            messagingSenderId: document.getElementById('fb-cfg-sender').value.trim(),
            appId: document.getElementById('fb-cfg-app').value.trim()
        };

        const res = await FirebaseService.saveConfig(newCfg);
        updateFirebaseStatusBadges();
        alert(res.message);
    }

    async function seedDefaultPapersToFirebase() {
        if (!confirm("This will upload all 10 built-in mock exam papers into Firestore. Proceed?")) return;
        const order = Array.from({ length: 10 }, (_, i) => i + 1);
        let count = 0;
        for (const pid of order) {
            const paper = generatePaperByID(pid);
            await FirebaseService.savePaper(paper);
            count++;
        }
        alert(`Successfully synced ${count} papers to backend!`);
        renderAdminPapers();
    }

    // Boot application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapApp);
    } else {
        bootstrapApp();
    }
})();

