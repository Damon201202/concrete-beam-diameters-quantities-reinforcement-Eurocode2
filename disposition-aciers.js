// Copyright © 2025 Dimitry Lyubichev / beton-guide.com
// Licensed under the MIT License.
// You may freely use, modify, and distribute this code under the terms of the MIT License.
// See the LICENSE file in the project root for details.

// Demarrage de calcul à ouverture de page
window.onload = function() {
    dispositionAciers();
};

let aS;
let b;
let h;
let cReel;
let Dmax;
let cmin;

document.querySelector('.calcul-four_as').addEventListener('input', dispositionAciers);
document.querySelector('.calcul-four_h').addEventListener('input', dispositionAciers);
document.querySelector('.calcul-four_b').addEventListener('input', dispositionAciers);
document.querySelector('.calcul-enrobage_reel').addEventListener('input', dispositionAciers);
document.querySelector('.calcul-dmax').addEventListener('input', dispositionAciers);
document.querySelector('.calcul-four-select-diam_cad').addEventListener('input', dispositionAciers);
document.querySelector('.calcul-four_as_marge_max').addEventListener('input', dispositionAciers);
document.querySelector('.calcul-enrobage_min').addEventListener('input', dispositionAciers);

// Tableau des sections d'acier disponibles et leurs diamètres correspondants, trié par diamètre décroissant
    const sections = [
        { diameter: 25, area: 4.91 },
        { diameter: 20, area: 3.14 },
        { diameter: 16, area: 2.01 },
        { diameter: 14, area: 1.54 },
        { diameter: 12, area: 1.13 },
        { diameter: 10, area: 0.78 },
        { diameter: 8, area: 0.5 },
        { diameter: 6, area: 0.28 }
    ];

function getAreaForDiameter(diameter) {
    const section = sections.find(s => s.diameter === diameter);
    return section ? section.area : 0;
}

function dispositionAciers() {
    aS = parseFloat(document.querySelector('.calcul-four_as').value) || 0;
    b = Number(document.querySelector('.calcul-four_b').value/100) || 0;
    h = Number(document.querySelector('.calcul-four_h').value/100) || 0;
    cReel = Number(document.querySelector('.calcul-enrobage_reel').value/100) || 0;
    Dmax = parseFloat(document.querySelector('.calcul-dmax').value) || 0;
    cmin = Number(document.querySelector('.calcul-enrobage_min').value*10) || 0;
    
    let AsMargeMax = 20;
    AsMargeMax = Number(document.querySelector('.calcul-four_as_marge_max').value) || 0;
    
    
   if (AsMargeMax < 0 || AsMargeMax > 100) {
    const alertBox = document.querySelector('.alert-element_as_marge_max');
    alertBox.innerHTML = 'Le pourcentage maximal d’ajustement de As doit se situer entre 0 et 100.';
    alertBox.style.display = 'block'; // 👈 Affiche l'alerte
} else {
    const alertBox = document.querySelector('.alert-element_as_marge_max');
    alertBox.innerHTML = '';
    alertBox.style.display = 'none'; // 👈 Cache l'alerte si tout va bien
    AsMargeMax = (AsMargeMax / 100) + 1;
}

    
    // Calcul st,max - l'espacement maximal des barres d'armature longitudinales
    let aMax = 25;
    
    
    let diamCad = parseFloat();	
    let select_diamCad = document.querySelector('.calcul-four-select-diam_cad');
    let selectedValue = select_diamCad.value; // Obtenir la valeur de l'élément sélectionné

    switch (selectedValue) {
        case '6':
            diamCad = 6;
            document.querySelector('.calcul-four-texte-diam_cad').innerHTML = 'Acier ∅6 HA  conseillé pour d ≤ 35cm;';
            break;
        case '8':
            diamCad = 8;
            document.querySelector('.calcul-four-texte-diam_cad').innerHTML = "Acier ∅8 HA  conseillé pour d ≤ 45cm;";
            break;
        case '10':
            diamCad = 10;
            document.querySelector('.calcul-four-texte-diam_cad').innerHTML = "Acier ∅10 HA  conseillé pour d ≤ 65cm;";
            break;
        case '12':
            diamCad = 12;
            document.querySelector('.calcul-four-texte-diam_cad').innerHTML = "Acier ∅12 HA  conseillé pour d ≤ 85cm;";
            break;
    }
    
    let Ncmin = Math.ceil((b*100 - 2*cReel*100) / aMax)+1; // Calculs pour la nombre minimale de colonnes 
    //document.querySelector('.calcul-four_ncmin').innerHTML = Ncmin;
    
    
    // Données pour trouver la configuration optimale
    //let Lit1 = 1; // Quantité de lits pour l'instant on utilise 1 seul lit
    let Nbar = 0; // Nombre de colonnes d’acier 1er lit;
    let Dac1 = 0; // Diamètre acier à utiliser pour 1ère lit
    //let acal; // Espacement min calculé entre les barres de 1er lit en mm
    //let AsReelLit1 = 0; // As reel des barres de 1er lit;
    //let areel = 0; // Espacement reel ente barres apres calcul
    //let DiffAs = 0; // Difference entre As_reel et As_calcul en %
    //let tableau;
    
    // Calculs pour Ncmax
    let aw = b * 1000 - 2 * (cReel * 1000 + diamCad); // Largeur à l'intérieur du cadre en mm
    
    
    
    
    function findOptimalConfiguration(aS, Ncmin, aw, aMax, Dmax) {
    let tableau = '';
        
    
    
    // Function to create tableau
function createTableau(layers) {
    let AsReel = layers.reduce((sum, layer) => sum + layer.As, 0);
    let DiffAs = ((AsReel / aS) - 1) * 100;

    // Extract data for each layer
    for (let i = 0; i < 5; i++) {
        if (i < layers.length) {
            window[`Lit${i+1}N`] = layers[i].Nbar;
            window[`Lit${i+1}D`] = layers[i].Dac;
            window[`Lit${i+1}S`] = getAreaForDiameter(layers[i].Dac);
        } else {
            window[`Lit${i+1}N`] = 0;
            window[`Lit${i+1}D`] = 0;
            window[`Lit${i+1}S`] = 0;
        }
    }

    // Update the DOM elements
    updateDOMElements();

    let tableauString = `
    <table>
        <caption style="font-weight: bold; margin-top: 10px;">DISPOSITION DES ARMATURES DE TRACTION</caption>
        <tr>
            <th>Lit</th>
            <td>Nombre</td>
            <td>Diametre</td>
            <td>a (esp. entre barres) :<br>max: ${aMax.toFixed(0)} cm; min: ${layers[0].acalMin.toFixed(0)/10} cm.</td>
            <td>As : ${aS.toFixed(2)} cm²<br>As Reel : ${AsReel.toFixed(2)} cm² (+${DiffAs.toFixed(0)}%)</td>
        </tr>`;
    
    layers.forEach((layer, index) => {
        tableauString += `
        <tr>
            <th>${index + 1}</th>
            <td>${layer.Nbar}</td>
            <td>${layer.Dac} mm</td>
            <td>${index === 0 ? layer.areel.toFixed(0)/10 + ' cm' : '-'}</td>
            <td>${layer.As.toFixed(2)} cm²</td>
        </tr>`;
    });
    
    tableauString += `</table>`;
    return tableauString;
}

        // to show resultats if calcul is updated
    function updateDOMElements() {
        const elements = [
            {class: 'calcul-four_nlit1', value: window.Lit1N},
            // Add more elements as needed
        ];

        elements.forEach(el => {
            const domEl = document.querySelector(`.${el.class}`);
            if (domEl) {
                domEl.innerHTML = el.value;
            }
        });
    }
        
    //document.querySelector('.calcul-four_nlit1').innerHTML = Lit2S;

    // Function to check if spacing is valid
    function isSpacingValid(areel, acalMin, aMax) {
        return areel >= acalMin && areel <= aMax * 10; // Convert aMax from cm to mm
    }

     // 1-layer configuration avec Ncmin = 2
for (let i = sections.length - 1; i >= 0; i--) {
    let currentNbar = 2;
    let currentDiam_i = sections[i].diameter;
    let acalMin = Math.max(currentDiam_i, 2 * cmin, 20, Dmax + 5);
    let aSmin = aS;
    let aSmax = aS * AsMargeMax;

    while (currentNbar <= Math.floor(aw / currentDiam_i)) {
        let As_i = sections[i].area * currentNbar;

        // Vérification avec l'exception pour aS < 0.45
        if ((As_i >= aSmin && As_i <= aSmax) || (aS < 0.45 && As_i >= aS)) {
            let areel = (aw - (currentDiam_i * currentNbar)) / (currentNbar - 1);
            if (isSpacingValid(areel, acalMin, aMax)) {
                let tableau = createTableau([{
                    Nbar: currentNbar,
                    Dac: currentDiam_i,
                    As: As_i,
                    acalMin: acalMin,
                    areel: areel
                }]);
                
               
                return tableau;
            }
        }

        currentNbar++;
    }
}


//console.log('No valid configuration found');
    


// Fonction pour trouver les diamètres valides en fonction du diamètre du premier lit
function getValidDiameters(diameterFirstLayer) {
    const validDiameters = [];

    if (diameterFirstLayer === 25) validDiameters.push(25, 20, 16);
    if (diameterFirstLayer === 20) validDiameters.push(20, 16, 14);
    if (diameterFirstLayer === 16) validDiameters.push(16, 14, 12);
    if (diameterFirstLayer === 14) validDiameters.push(14, 12, 10);
    if (diameterFirstLayer === 12) validDiameters.push(12, 10, 8);
    if (diameterFirstLayer === 10) validDiameters.push(10, 8, 6);
    if (diameterFirstLayer === 8) validDiameters.push(8, 6);

    return validDiameters;
}

// 2-layer configuration
for (let i_2 = 0; i_2 < sections.length; i_2++) {
    let currentNbar1 = Ncmin;
    let currentDiam_1 = sections[i_2].diameter;
    let As2_1 = sections[i_2].area * currentNbar1;

    let acalMin_1 = Math.max(2 * cmin, 50, Dmax + 5);
    let aSmax = aS * AsMargeMax;
    let currentNbar1_check = Math.floor(aw / currentDiam_1);
    let validDiameters = getValidDiameters(currentDiam_1);
   

    while (As2_1 < aSmax && currentNbar1 <= currentNbar1_check) {
        let areel_1 = (aw - (currentDiam_1 * currentNbar1)) / (currentNbar1 - 1);

        if (areel_1 > acalMin_1) {
            let aSlit2 = aS - As2_1;

            for (let j = 0; j < sections.length; j++) {
                let diam2 = sections[j].diameter;
                if (!validDiameters.includes(diam2)) {
                    continue;
                }

                for (let nbars2 = 2; nbars2 <= currentNbar1; nbars2++) {
                    if (currentNbar1 % 2 === 0 && nbars2 % 2 !== 0) continue;

                    let As2_2 = sections[j].area * nbars2;
                    let As2_2_Total = As2_1 + As2_2;

                    if (As2_2 >= aSlit2 && As2_2_Total <= aS * AsMargeMax) {
                        
                        tableau = createTableau([
                            { Nbar: currentNbar1, Dac: currentDiam_1, As: As2_1, acalMin: acalMin_1, areel: areel_1 },
                            { Nbar: nbars2, Dac: diam2, As: As2_2, acalMin: acalMin_1, areel: 0 }
                        ]);
                        return tableau;
                    }
                }
            }
        }
        currentNbar1++;
        As2_1 = sections[i_2].area * currentNbar1;
    }
}

    // 3-layer configuration
for (let i_3 = 0; i_3 < sections.length; i_3++) {
    let currentNbar3_1 = Ncmin;
    let As3_1 = sections[i_3].area * currentNbar3_1;
    let currentDiam3_1 = sections[i_3].diameter;
    let acalMin3_1 = Math.max(2*cmin, 50, Dmax + 5);
    
    // Déterminer les diamètres valides pour la 2e couche
    const currentDiamIndex_1 = i_3;
    const maxSecondLayerIndex = Math.min(currentDiamIndex_1 + 2, sections.length - 1);
    
    // Afficher les diamètres disponibles pour la 2e couche
    let availableDiams = [];
    for (let j = currentDiamIndex_1; j <= maxSecondLayerIndex; j++) {
        availableDiams.push(sections[j].diameter);
    }
    
    let currentNbar3_1check = Math.floor(aw / currentDiam3_1);
    while (As3_1 < aS * AsMargeMax && currentNbar3_1 <= currentNbar3_1check) {
        let areel3_1 = (aw - (currentDiam3_1 * currentNbar3_1)) / (currentNbar3_1 - 1);
        
        if (areel3_1 > acalMin3_1) {
            let aSlit3_2 = aS - As3_1;
            
            // Find second layer (limité aux diamètres actuels et 2 plus petits)
            for (let j_idx = currentDiamIndex_1; j_idx <= maxSecondLayerIndex; j_idx++) {
                let j_3_2 = j_idx; // Indice dans le tableau sections
                
                for (let nbars3_2 = 2; nbars3_2 <= currentNbar3_1; nbars3_2++) {
                    // Condition pour la deuxième couche
                    if (currentNbar3_1 % 2 === 0 && nbars3_2 % 2 !== 0) {
                        continue; // Passe à l'itération suivante si la condition n'est pas respectée
                    }
                    
                    let As3_2 = sections[j_3_2].area * nbars3_2;
                    let As3_2_Total = As3_1 + As3_2;
                    
                    if (As3_2 <= aSlit3_2 && As3_2_Total <= aS * AsMargeMax) {
                        let aSlit3_3 = aS - As3_1 - As3_2;
                        
                        // Déterminer les diamètres valides pour la 3e couche (du 2e diamètre et 2 plus petits)
                        const currentDiamIndex_2 = j_3_2;
                        const maxThirdLayerIndex = Math.min(currentDiamIndex_2 + 2, sections.length - 1);
                        
                        // Find third layer (limité aux diamètres du 2e lit et 2 plus petits)
                        for (let k_idx = currentDiamIndex_2; k_idx <= maxThirdLayerIndex; k_idx++) {
                            let j_3_3 = k_idx; // Indice dans le tableau sections
                            
                            for (let nbars3_3 = 2; nbars3_3 <= nbars3_2; nbars3_3++) {
                                // Condition pour la troisième couche
                                if (nbars3_2 % 2 === 0 && nbars3_3 % 2 !== 0) {
                                    continue; // Passe à l'itération suivante si la condition n'est pas respectée
                                }
                                
                                let As3_3 = sections[j_3_3].area * nbars3_3;
                                let As3_3_Total = As3_1 + As3_2 + As3_3;
                                
                                if (As3_3 >= aSlit3_3 && As3_3_Total <= aS * AsMargeMax) {
                                    tableau = createTableau([
                                        {Nbar: currentNbar3_1, Dac: currentDiam3_1, As: As3_1, acalMin: acalMin3_1, areel: areel3_1},
                                        {Nbar: nbars3_2, Dac: sections[j_3_2].diameter, As: As3_2, acalMin: acalMin3_1, areel: 50},
                                        {Nbar: nbars3_3, Dac: sections[j_3_3].diameter, As: As3_3, acalMin: acalMin3_1, areel: 0}
                                    ]);
                                    
                                    return tableau;  // Found optimal 3-layer configuration
                                }
                            }
                        }
                    }
                }
            }
        }
        currentNbar3_1++;
        As3_1 = sections[i_3].area * currentNbar3_1;
    }
}
        
   // 4-layer configuration
for (let i_4 = 0; i_4 < sections.length; i_4++) {
    let currentNbar4_1 = Ncmin;
    let As4_1 = sections[i_4].area * currentNbar4_1;
    let currentDiam4_1 = sections[i_4].diameter;
    let acalMin4_1 = Math.max(2*cmin, 50, Dmax + 5);
    
    // Déterminer les diamètres valides pour la 2e couche
    const currentDiamIndex_1 = i_4;
    const maxSecondLayerIndex = Math.min(currentDiamIndex_1 + 2, sections.length - 1);
    
    // Afficher les diamètres disponibles pour la 2e couche
    let availableDiams2 = [];
    for (let j = currentDiamIndex_1; j <= maxSecondLayerIndex; j++) {
        availableDiams2.push(sections[j].diameter);
    }
    
    let currentNbar4_1check = Math.floor(aw / currentDiam4_1);
    while (As4_1 < aS * AsMargeMax && currentNbar4_1 <= currentNbar4_1check) {
        let areel4_1 = (aw - (currentDiam4_1 * currentNbar4_1)) / (currentNbar4_1 - 1);
        
        if (areel4_1 > acalMin4_1) {
            let aSlit4_2 = aS - As4_1;
            
            // Find second layer (limité aux diamètres actuels et 2 plus petits)
            for (let j_idx = currentDiamIndex_1; j_idx <= maxSecondLayerIndex; j_idx++) {
                let j_4_2 = j_idx; // Indice dans le tableau sections
                
                for (let nbars4_2 = 2; nbars4_2 <= currentNbar4_1; nbars4_2++) {
                    // Condition pour la deuxième couche
                    if (currentNbar4_1 % 2 === 0 && nbars4_2 % 2 !== 0) {
                        continue; // Passe à l'itération suivante si la condition n'est pas respectée
                    }
                    
                    let As4_2 = sections[j_4_2].area * nbars4_2;
                    let As4_2_Total = As4_1 + As4_2;
                    
                    if (As4_2 <= aSlit4_2 && As4_2_Total <= aS * AsMargeMax) {
                        let aSlit4_3 = aS - As4_1 - As4_2;
                        
                        // Déterminer les diamètres valides pour la 3e couche (du 2e diamètre et 2 plus petits)
                        const currentDiamIndex_2 = j_4_2;
                        const maxThirdLayerIndex = Math.min(currentDiamIndex_2 + 2, sections.length - 1);
                        
                        // Afficher les diamètres disponibles pour la 3e couche
                        let availableDiams3 = [];
                        for (let k = currentDiamIndex_2; k <= maxThirdLayerIndex; k++) {
                            availableDiams3.push(sections[k].diameter);
                        }
                        if (As4_2 > 0) { // Pour ne pas surcharger les logs
                            //console.log(`Diamètres valides pour la 3e couche (avec 2e couche de ${sections[j_4_2].diameter}mm) : ${availableDiams3.join(', ')}`);
                        }
                        
                        // Find third layer (limité aux diamètres du 2e lit et 2 plus petits)
                        for (let k_idx = currentDiamIndex_2; k_idx <= maxThirdLayerIndex; k_idx++) {
                            let j_4_3 = k_idx; // Indice dans le tableau sections
                            
                            for (let nbars4_3 = 2; nbars4_3 <= nbars4_2; nbars4_3++) {
                                // Condition pour la troisième couche
                                if (nbars4_2 % 2 === 0 && nbars4_3 % 2 !== 0) {
                                    continue; // Passe à l'itération suivante si la condition n'est pas respectée
                                }
                                
                                let As4_3 = sections[j_4_3].area * nbars4_3;
                                let As4_3_Total = As4_1 + As4_2 + As4_3;
                                
                                if (As4_3 <= aSlit4_3 && As4_3_Total <= aS * AsMargeMax) {
                                    let aSlit4_4 = aS - As4_1 - As4_2 - As4_3;
                                    
                                    // Déterminer les diamètres valides pour la 4e couche (du 3e diamètre et 2 plus petits)
                                    const currentDiamIndex_3 = j_4_3;
                                    const maxFourthLayerIndex = Math.min(currentDiamIndex_3 + 2, sections.length - 1);
                                    
                                    // Find fourth layer (limité aux diamètres du 3e lit et 2 plus petits)
                                    for (let l_idx = currentDiamIndex_3; l_idx <= maxFourthLayerIndex; l_idx++) {
                                        let j_4_4 = l_idx; // Indice dans le tableau sections
                                        
                                        for (let nbars4_4 = 2; nbars4_4 <= nbars4_3; nbars4_4++) {
                                            // Condition pour la quatrième couche
                                            if (nbars4_3 % 2 === 0 && nbars4_4 % 2 !== 0) {
                                                continue; // Passe à l'itération suivante si la condition n'est pas respectée
                                            }
                                            
                                            let As4_4 = sections[j_4_4].area * nbars4_4;
                                            let As4_4_Total = As4_1 + As4_2 + As4_3 + As4_4;
                                            
                                            if (As4_4 >= aSlit4_4 && As4_4_Total <= aS * AsMargeMax) {
                                                tableau = createTableau([
                                                    {Nbar: currentNbar4_1, Dac: currentDiam4_1, As: As4_1, acalMin: acalMin4_1, areel: areel4_1},
                                                    {Nbar: nbars4_2, Dac: sections[j_4_2].diameter, As: As4_2, acalMin: acalMin4_1, areel: 50},
                                                    {Nbar: nbars4_3, Dac: sections[j_4_3].diameter, As: As4_3, acalMin: acalMin4_1, areel: 50},
                                                    {Nbar: nbars4_4, Dac: sections[j_4_4].diameter, As: As4_4, acalMin: acalMin4_1, areel: 0}
                                                ]);
                                                
                                                return tableau;  // Found optimal 4-layer configuration
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        currentNbar4_1++;
        As4_1 = sections[i_4].area * currentNbar4_1;
    }
}
// 5-layer configuration
for (let i_5 = 0; i_5 < sections.length; i_5++) {
    let currentNbar5_1 = Ncmin;
    let As5_1 = sections[i_5].area * currentNbar5_1;
    let currentDiam5_1 = sections[i_5].diameter;
    let acalMin5_1 = Math.max(2*cmin, 50, Dmax + 5);
    
    // Déterminer les diamètres valides pour la 2e couche
    const currentDiamIndex_1 = i_5;
    const maxSecondLayerIndex = Math.min(currentDiamIndex_1 + 2, sections.length - 1);
    
    // Afficher les diamètres disponibles pour la 2e couche
    let availableDiams2 = [];
    for (let j = currentDiamIndex_1; j <= maxSecondLayerIndex; j++) {
        availableDiams2.push(sections[j].diameter);
    }
    let currentNbar5_1check = Math.floor(aw / currentDiam5_1);
    while (As5_1 < aS * AsMargeMax && currentNbar5_1 <= currentNbar5_1check) {
        let areel5_1 = (aw - (currentDiam5_1 * currentNbar5_1)) / (currentNbar5_1 - 1);
        
        if (areel5_1 > acalMin5_1) {
            let aSlit5_2 = aS - As5_1;
            
            // Find second layer (limité aux diamètres actuels et 2 plus petits)
            for (let j_idx = currentDiamIndex_1; j_idx <= maxSecondLayerIndex; j_idx++) {
                let j_5_2 = j_idx; // Indice dans le tableau sections
                
                for (let nbars5_2 = 2; nbars5_2 <= currentNbar5_1; nbars5_2++) {
                    // Condition pour la deuxième couche
                    if (currentNbar5_1 % 2 === 0 && nbars5_2 % 2 !== 0) {
                        continue; // Passe à l'itération suivante si la condition n'est pas respectée
                    }
                    
                    let As5_2 = sections[j_5_2].area * nbars5_2;
                    let As5_2_Total = As5_1 + As5_2;
                    
                    if (As5_2 <= aSlit5_2 && As5_2_Total <= aS * AsMargeMax) {
                        let aSlit5_3 = aS - As5_1 - As5_2;
                        
                        // Déterminer les diamètres valides pour la 3e couche (du 2e diamètre et 2 plus petits)
                        const currentDiamIndex_2 = j_5_2;
                        const maxThirdLayerIndex = Math.min(currentDiamIndex_2 + 2, sections.length - 1);
                        
                        // Afficher les diamètres disponibles pour la 3e couche
                        let availableDiams3 = [];
                        for (let k = currentDiamIndex_2; k <= maxThirdLayerIndex; k++) {
                            availableDiams3.push(sections[k].diameter);
                        }
                        if (As5_2 > 0) { // Pour ne pas surcharger les logs
                            //console.log(`Diamètres valides pour la 3e couche (avec 2e couche de ${sections[j_5_2].diameter}mm) : ${availableDiams3.join(', ')}`);
                        }
                        
                        // Find third layer (limité aux diamètres du 2e lit et 2 plus petits)
                        for (let k_idx = currentDiamIndex_2; k_idx <= maxThirdLayerIndex; k_idx++) {
                            let j_5_3 = k_idx; // Indice dans le tableau sections
                            
                            for (let nbars5_3 = 2; nbars5_3 <= nbars5_2; nbars5_3++) {
                                // Condition pour la troisième couche
                                if (nbars5_2 % 2 === 0 && nbars5_3 % 2 !== 0) {
                                    continue; // Passe à l'itération suivante si la condition n'est pas respectée
                                }
                                
                                let As5_3 = sections[j_5_3].area * nbars5_3;
                                let As5_3_Total = As5_1 + As5_2 + As5_3;
                                
                                if (As5_3 <= aSlit5_3 && As5_3_Total <= aS * AsMargeMax) {
                                    let aSlit5_4 = aS - As5_1 - As5_2 - As5_3;
                                    
                                    // Déterminer les diamètres valides pour la 4e couche (du 3e diamètre et 2 plus petits)
                                    const currentDiamIndex_3 = j_5_3;
                                    const maxFourthLayerIndex = Math.min(currentDiamIndex_3 + 2, sections.length - 1);
                                    
                                    // Afficher les diamètres disponibles pour la 4e couche
                                    let availableDiams4 = [];
                                    for (let l = currentDiamIndex_3; l <= maxFourthLayerIndex; l++) {
                                        availableDiams4.push(sections[l].diameter);
                                    }
                                    if (As5_3 > 0) { // Pour ne pas surcharger les logs
                                        //console.log(`Diamètres valides pour la 4e couche (avec 3e couche de ${sections[j_5_3].diameter}mm) : ${availableDiams4.join(', ')}`);
                                    }
                                    
                                    // Find fourth layer (limité aux diamètres du 3e lit et 2 plus petits)
                                    for (let l_idx = currentDiamIndex_3; l_idx <= maxFourthLayerIndex; l_idx++) {
                                        let j_5_4 = l_idx; // Indice dans le tableau sections
                                        
                                        for (let nbars5_4 = 2; nbars5_4 <= nbars5_3; nbars5_4++) {
                                            // Condition pour la quatrième couche
                                            if (nbars5_3 % 2 === 0 && nbars5_4 % 2 !== 0) {
                                                continue; // Passe à l'itération suivante si la condition n'est pas respectée
                                            }
                                            
                                            let As5_4 = sections[j_5_4].area * nbars5_4;
                                            let As5_4_Total = As5_1 + As5_2 + As5_3 + As5_4;
                                            
                                            if (As5_4 <= aSlit5_4 && As5_4_Total <= aS * AsMargeMax) {
                                                let aSlit5_5 = aS - As5_1 - As5_2 - As5_3 - As5_4;
                                                
                                                // Déterminer les diamètres valides pour la 5e couche (du 4e diamètre et 2 plus petits)
                                                const currentDiamIndex_4 = j_5_4;
                                                const maxFifthLayerIndex = Math.min(currentDiamIndex_4 + 2, sections.length - 1);
                                                
                                                // Afficher les diamètres disponibles pour la 5e couche
                                                let availableDiams5 = [];
                                                for (let m = currentDiamIndex_4; m <= maxFifthLayerIndex; m++) {
                                                    availableDiams5.push(sections[m].diameter);
                                                }
                                                if (As5_4 > 0) { // Pour ne pas surcharger les logs
                                                    //console.log(`Diamètres valides pour la 5e couche (avec 4e couche de ${sections[j_5_4].diameter}mm) : ${availableDiams5.join(', ')}`);
                                                }
                                                
                                                // Find fifth layer (limité aux diamètres du 4e lit et 2 plus petits)
                                                for (let m_idx = currentDiamIndex_4; m_idx <= maxFifthLayerIndex; m_idx++) {
                                                    let j_5_5 = m_idx; // Indice dans le tableau sections
                                                    
                                                    for (let nbars5_5 = 2; nbars5_5 <= nbars5_4; nbars5_5++) {
                                                        // Condition pour la cinquième couche
                                                        if (nbars5_4 % 2 === 0 && nbars5_5 % 2 !== 0) {
                                                            continue; // Passe à l'itération suivante si la condition n'est pas respectée
                                                        }
                                                        
                                                        let As5_5 = sections[j_5_5].area * nbars5_5;
                                                        let As5_5_Total = As5_1 + As5_2 + As5_3 + As5_4 + As5_5;
                                                        
                                                        if (As5_5 >= aSlit5_5 && As5_5_Total <= aS * AsMargeMax) {
                                                            tableau = createTableau([
                                                                {Nbar: currentNbar5_1, Dac: currentDiam5_1, As: As5_1, acalMin: acalMin5_1, areel: areel5_1},
                                                                {Nbar: nbars5_2, Dac: sections[j_5_2].diameter, As: As5_2, acalMin: acalMin5_1, areel: 50},
                                                                {Nbar: nbars5_3, Dac: sections[j_5_3].diameter, As: As5_3, acalMin: acalMin5_1, areel: 50},
                                                                {Nbar: nbars5_4, Dac: sections[j_5_4].diameter, As: As5_4, acalMin: acalMin5_1, areel: 50},
                                                                {Nbar: nbars5_5, Dac: sections[j_5_5].diameter, As: As5_5, acalMin: acalMin5_1, areel: 0}
                                                            ]);
                                                           
                                                            return tableau;  // Found optimal 5-layer configuration
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        currentNbar5_1++;
        As5_1 = sections[i_5].area * currentNbar5_1;
    }
}
       
        let returnAlert;
        
        if (aS <= 0) {
            returnAlert = "";
            } else {
            returnAlert = "<p style='color: red; font-weight: bold;'>Aucune configuration appropriée trouvée : <br>1. Modifier le pourcentage maximal d’ajustement (%As_max); <br>2. Augmenter la largeur de la poutre (b); <br>3. Modifier le diamètre de l’acier transversal du cadre (∅w,cad).</p>";  
            }
        

    return returnAlert;
        
    
}

    
    // Usage
    document.querySelector('.table-acier_long').innerHTML = findOptimalConfiguration(aS, Ncmin, aw, aMax, Dmax);
   
    
    // Espacement reel apres calcul
    let areelVerif = (aw-(Dac1*Nbar))/(Nbar-1);
    
    
    let select_diamCadNumber = parseFloat(select_diamCad.value);
    
   

    // Calcul de dReel en utilisant les variables converties
    let aMin = Math.max(window.Lit1D, 20, (Dmax + 5)); // a1 - l'espasement min vertical

    let dReel = (h - (
    (window.Lit1N * window.Lit1S / 10000 * (cReel + select_diamCadNumber / 1000 + ((window.Lit1D / 1000) / 2)) +
    window.Lit2N * window.Lit2S / 10000 * (cReel + select_diamCadNumber / 1000 + (window.Lit1D / 1000) + ((window.Lit2D / 1000) / 2)) +
    window.Lit3N * window.Lit3S / 10000 * (cReel + select_diamCadNumber / 1000 + (window.Lit1D / 1000) + (window.Lit2D / 1000) + aMin/1000 + ((window.Lit3D / 1000) / 2)) +
    window.Lit4N * window.Lit4S / 10000 * (cReel + select_diamCadNumber / 1000 + (window.Lit1D / 1000) + (window.Lit2D / 1000) + aMin/1000 + (window.Lit3D / 1000) + ((window.Lit4D / 1000) / 2)) +
    window.Lit5N * window.Lit5S / 10000 * (cReel + select_diamCadNumber / 1000 + (window.Lit1D / 1000) + (window.Lit2D / 1000) + aMin/1000 + (window.Lit3D / 1000) + (window.Lit4D / 1000) + aMin/1000 + ((window.Lit5D / 1000) / 2))) /
    (window.Lit1N * window.Lit1S / 10000 + window.Lit2N * window.Lit2S / 10000 + window.Lit3N * window.Lit3S / 10000 + window.Lit4N * window.Lit4S / 10000 + window.Lit5N * window.Lit5S / 10000)
    ))*100;
    
    //console.log(`Lit1D: ${window.Lit1D}, Dmax: ${Dmax}, window.Lit1D/1000: ${window.Lit1D/1000}, a: ${aMin}, h: ${h},`);

    document.querySelector('.calcul-four_dreel').innerHTML = dReel.toFixed(1); // Affichage du résultat
    document.querySelector('.calcul-four_a1').innerHTML = aMin.toFixed(2)/10; // Affichage du résultat

}

