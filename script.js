function submitFunc() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('word')) {
        var userInput = urlParams.get("word");
        var lowercaseInput = userInput.toLowerCase();
        lowercaseInput = lowercaseInput.replace(/ /g,"%"); // replace the spaces w/ symbol to later replace w/ line breaks

        document.getElementById("word").value = userInput; //puts userInput into input field for clarity's sake

        var output = {};
        var explanation = {};

        const broadVowels = ["a","o","u","á","ó","ú"];
        const slenderVowels = ["e","i","é","í"];

        const characterSets = [
            "mb","gc","nd","bhf","ng","bp","ts","dt", // eclipsed consonants (urú)
            "ghdh", // whatever this is
            "eadh","ea","faidh","fidh","áil","aoi","ao","ae","eo","ia","ua","io","ui", // dipthongs & weirdos
            "bh","mh","dh","ch","fh","gh","ph","sh","th", // aspirated consonants
            "b","c","d","f","g","l","m","n","p","r","s","t", // consonants
            "v","j","q","z","k","x","w","y", // the hateful eight
            "a","e","i","o","u", // vowels
            "á","é","í","ó","ú", // vowels with fadas
            "%" //dumb hack to put each new word on a new line
        ];
        const pronunciationOf = {
            "ae" : "<div class='has-as'>ay <span class='as-in'>(as in 'tray')</span></div>",
            "aoi" : "<div class='has-as'>ee <span class='as-in'>(as in 'tree')</span></div>",
            "ao" : "<div class='has-as'>ee <span class='as-in'>(as in 'tree')</span></div>",
            "eo" : "<div class='has-as'>oh <span class='as-in'>(as in 'Joe')</span></div>",
            "ia" : "<div class='has-as'>e-uh <span class='as-in'>(as in 'see a')</span></div>",
            "ua" : "<div class='has-as'>ooo-uh <span class='as-in'>(as in 'truant')</span></div>",

            "eadh": "<div class='has-as'>eh <span class='as-in'>(as in 'hey')</span></div>",
            "ea" : "<div class='has-as'>aah <span class='as-in'>(as in 'mass')</span></div>",
            "io" : "<div class='has-as'>ih <span class='as-in'>(as in 'miss')</span></div>",
            "ui" : "<div class='has-as'>ih <span class='as-in'>(as in 'miss')</span></div>",

            "á" : "<div class='has-as'>aw <span class='as-in'>(as in 'paw')</span></div>",
            "é" : "<div class='has-as'>eh <span class='as-in'>(as in 'hey')</span></div>",
            "í" : "<div class='has-as'>ee <span class='as-in'>(as in 'tree')</span></div>",
            "ó" : "<div class='has-as'>oh <span class='as-in'>(as in 'Joe')</span></div>",
            "ú" : "<div class='has-as'>ooh <span class='as-in'>(as in 'shoe')</span></div>",

            "a" : "<div class='has-as'>ah <span class='as-in'>(as in 'America')</span></div>",
            "e" : "<div class='has-as'>eh <span class='as-in'>(as in 'peck')</span></div>",
            "i" : "<div class='has-as'>ih <span class='as-in'>(as in 'miss')</span></div>",
            "o" : "<div class='has-as'>ah <span class='as-in'>(as in 'mock')</span></div>",
            "u" : "<div class='has-as'>uh <span class='as-in'>(as in 'muck')</span></div>",

            // eclipsed consonants (urú)
            "mb" : "m",
            "gc" : "g",
            "nd" : "n",
            "bhf" : ["slenderBroad", "v", "w"],
            "ng" : "n",
            "bp" : "b",
            "ts" : ["slenderBroad", "ch", "t"],
            "dt" : ["slenderBroad", "j", "d"], 

            "bh" : ["slenderBroad", "v", "w"],
            "mh" : ["slenderBroad", "v", "w"],
            "ch" : "<div class='has-as'>ch <span class='as-in'>(but guttural, as in 'loch' or 'chutzpah')</span></div>",
            "fh" : null,
            "ghdh" : null,
            "dh" : ["slenderBroad", "y", "g"],
            "d" : ["slenderBroad", "j", "d"],
            "gh" : ["slenderBroad", "y", "g"],
            "sh" : "h",
            "th" : "h",
            "ph" : "f",

            "h" : null,
            "b" : "b",
            "f" : ["lastCharacter", "f", "v"],
            "l" : ["slenderBroad", "l", "l"],
            "r" : ["slenderBroad", "r", "<div class='has-as'>r <span class='as-in'>rolled</span></div>"],
            "g" : "g",
            "m" : "m",
            "n" : "n",
            "p" : "p",
            "c" : "k",
            
            "v" : "v",
            "x" : "x",
            "k" : "?",
            "w" : "?",
            "y" : "y",
            "q" : "?",
            "z" : "z",            
            "j" : "j",            

            "t" : ["slenderBroad", "ch", "t"],
            "s" : ["slenderBroad", "sh", "s"],

            "%" : "/"

        }
        const explanationOf = {
            "ae" : "<li>'ae' sounds like 'ay' as in 'tray'</li>",
            "aoi" : "<li>'ao' and 'aoi' sound like 'ee' as in 'tree'</li>",
            "ao" : "<li>'ao' and 'aoi' sound like 'ee' as in 'tree'</li>",
            "eo" : "<li>'eo' sound like 'oh' as in 'Joe'</li>",
            "ia" : "<li>'ia' sounds like 'e-uh' as in 'see a'</li>",
            "ua" : "<li>'ua' sounds like 'ooo-uh' as in 'truant'</li>",

            "ea" : "<li>'ea' sounds like 'aah' as in 'mass'</li>",
            "io" : "<li>'io' and 'ui' sound like 'ih' as in 'miss'</li>",
            "ui" : "<li>'io' and 'ui' sound like 'ih' as in 'miss'</li>",

            "á" : "<li>'á' (with a fada) sounds like 'aw' as in 'paw'</span></li>",
            "é" : "<li>'é' (with a fada) sounds like 'eh' as in 'hey'</span></li>",
            "í" : "<li>'í' (with a fada) sounds like 'ee' as in 'tree'</span></li>",
            "ó" : "<li>'ó' (with a fada) sounds like 'oh' as in 'Joe'</span></li>",
            "ú" : "<li>'ú' (with a fada) sounds like 'ooh' as in 'shoe'</span></li>",

            "a" : "<li>'a sounds like 'ah' as in 'America'</span></li>",
            "e" : "<li>'e' sounds like 'eh' as in 'peck'</span></li>",
            "i" : "<li>'i' sounds like 'ih' as in 'miss'</span></li>",
            "o" : "<li>'o' sounds like 'ah' as in 'mock'</span></li>",
            "u" : "<li>'u' sounds like 'uh' as in 'muck'</span></li>",

            "ghdh" : "<li>'ghdh' is probably silent</li>",
            "h" : "<li>'h' on it's own is probably either silent or a sort of breath</li>",

            // eclipsed consonants (urú)
            "mb" : "<li>'mb' is an exlipsed consonant. The last letter is silent, so this is just pronounced as an 'm' here.</li>",
            "gc" : "<li>'gc' is an exlipsed consonant. The last letter is silent, so this is just pronounced as an 'g' here.</li>",
            "nd" : "<li>'nd' is an exlipsed consonant. The last letter is silent, so this is just pronounced as an 'n' here.</li>",
            "bhf" : ["<li>'bhf' is an exlipsed consonant. The last letter is silent, so this is just pronounced as a BH would be here, which sounds like 'v' (since it precedes a slender vowel).</li>", "<li>'bhf' is an exlipsed consonant. The last letter is silent, so this is just pronounced as a BH would be here, which sounds like 'w' (since it precedes a broad vowel).</li>"],
            "ng" : "<li>'ng' is an exlipsed consonant. The last letter is silent, so this is just pronounced as an 'n' here.</li>",
            "bp" : "<li>'bp' is an exlipsed consonant. The last letter is silent, so this is just pronounced as an 'b' here.</li>",
            "ts" : ["<li>'ts' is an exlipsed consonant. The last letter is silent, so this is just pronounced as a T would be here, which sounds like 'ch' (since it precedes a slender vowel).</li>", "<li>'ts' is an exlipsed consonant. The last letter is silent, so this is just pronounced as a T would be here, which sounds like 't' (since it precedes a broad vowel).</li>"],
            "dt" : ["<li>'dt' is an exlipsed consonant. The last letter is silent, so this is just pronounced as a D would be here, which sounds like 'j' (since it precedes a slender vowel).</li>", "<li>'dt' is an exlipsed consonant. The last letter is silent, so this is just pronounced as a D would be here, which sounds like 'd' (since it precedes a broad vowel).</li>"], 

            "bh" : ["<li>'bh' and 'mh' make a 'v' sound when they precede or follow a slender vowel</li>","<li>'bh' and 'mh' make a 'w' sound when they precede or follow a broad vowel</li>"],
            "mh" : ["<li>'bh' and 'mh' make a 'v' sound when they precede or follow a slender vowel</li>","<li>'bh' and 'mh' make a 'w' sound when they precede or follow a broad vowel</li>"],
            "dh" : ["<li>'dh' and 'gh' make a 'y' sound when they precede or follow a slender vowel</li>","<li>'dh' and 'gh' make a 'g' sound when they precede or follow a broad vowel</li>"],
            "gh" : ["<li>'dh' and 'gh' make a 'y' sound when they precede or follow a slender vowel</li>","<li>'dh' and 'gh' make a 'g' sound when they precede or follow a broad vowel</li>"],            "fh" : "<li>'fh' is usually silent</li>",            
            "sh" : "<li>'sh' sounds like an 'h'</li>",
            "th" : "<li>'th' sounds like an 'h'</li>",

            "d" : ["<li>'d' makes a 'j' sound when it precedes or follows a slender vowel</li>","<li>'d' sounds like you'd expect when it precedes or follows a broad vowel</li>"],
            "f" : ["<li>'f' usually sounds how you'd expect</li>", "<li>'f' maybe(?) makes a 'v' sound when it appears at the end of a word</li>"],
            "l" : ["<li>'l' makes a 'ly' when it precedes or follows a slender vowel</li>", "<li>'l' sounds like you'd expect when it precedes or follows a broad vowel</li>"],
            "r" : ["<li>'r' makes an 'r' when it precedes or follows a slender vowel</li>", "<li>'r' makes a rolled 'r' sound when it precedes or follows a broad vowel</li>"],
            "b" : "<li>'b' is what it says on the tin</li>",
            "g" : "<li>'g' is what it says on the tin</li>",
            "m" : "<li>'m' is what it says on the tin</li>",
            "n" : "<li>'n' is what it says on the tin</li>",
            "p" : "<li>'p' is what it says on the tin</li>",
            "ph" : "<li>'ph' makes an 'f' sound</li>",
            "c" : "<li>'c' is always a hard 'c' or 'k' sound, as in 'cat'</li>",
            "ch" : "<li>'ch' is guttural, like 'loch' or 'chutzpah'</li>",

            "v" : "<li>'v' is not a traditional Irish character, but when it appears it is pronounced as an English-speaker would expect</li>",
            "z" : "<li>'z' is not a traditional Irish character, but when it appears it is pronounced as an English-speaker would expect</li>",
            "j" : "<li>'j' is not a traditional Irish character, but when it appears it is pronounced as an English-speaker would expect</li>",
            "x" : "<li>'x' is not a traditional Irish character, but when it appears it is pronounced as an English-speaker would expect</li>",
            "q" : "<li>'q' is not a traditional Irish character. Are you sure this is an Irish word?</li>",
            "w" : "<li>'w' is not a traditional Irish character. Are you sure this is an Irish word?</li>",
            "k" : "<li>'k' is not a traditional Irish character. Are you sure this is an Irish word?</li>",
            "y" : "<li>'y' is not a traditional Irish character. But it's probably pronounced as you'd think.</li>",

            "t" : ["<li>'t' makes a 'ch' sound (as in 'chuck') when preceded or followed by a slender vowel</li>","<li>'t' makes a standard 't' sound when preceded or followed by a broad vowel</li>"],
            "s" : ["<li>'s' makes a 'sh' sound (as in 'shoe') when preceded or followed by a slender vowel</li>","<li>'s' makes a standard 's' sound (as in 'snake') when preceded or followed by a broad vowel</li>"],
        }

        function theWork() {
            for (characterSet of characterSets) {
                var index = lowercaseInput.indexOf(characterSet);
                if (index > -1) {
                    if (pronunciationOf[characterSet] instanceof Array) { // its an array if there are conditional rules
                        let conditional = pronunciationOf[characterSet][0];                
                        if ( conditional == "slenderBroad") {
                            let slenderResult = pronunciationOf[characterSet][1];
                            let broadResult = pronunciationOf[characterSet][2];
                            if ( (slenderVowels.includes(userInput.charAt(index - 1))) // if characterSet follows 
                            || (slenderVowels.includes(userInput.charAt(index + characterSet.length))) ) { // or if characterSet is followed by 
                                var outputToPush = slenderResult;
                                var explanationToPush = explanationOf[characterSet][0];
                            } else {
                                var outputToPush = broadResult;
                                var explanationToPush = explanationOf[characterSet][1];
                            }
                        } else if ( conditional == "lastCharacter") {
                            let notLastChar = pronunciationOf[characterSet][1];
                            let lastChar = pronunciationOf[characterSet][2];

                            if ( userInput.charAt(index + characterSet.length) ){
                                var outputToPush = notLastChar;
                                var explanationToPush = explanationOf[characterSet][0];
                            } else { // if charSet is the last character
                                var outputToPush = lastChar;
                                var explanationToPush = explanationOf[characterSet][1];
                            }
                        }
                    } else { // no conditional rules = always pronounced the same
                        var outputToPush = pronunciationOf[characterSet];
                        var explanationToPush = explanationOf[characterSet];
                    }

                    output[index] = outputToPush; // adding value as key=>val pair, keyed by index for ordering
                    explanation[index] = explanationToPush; 
                    outputArray = Object.values(output); // now convert to array for later "join"-ing           
                    explanationArray = Object.values(explanation);

                    var removedCharacters = "*".repeat(characterSet.length);
                    lowercaseInput = lowercaseInput.replace(characterSet,removedCharacters); // reseting this as string minus the characterSet that was just run
                    console.log(lowercaseInput);
                    
                    theWork();
                }
            }

            /*if (lowercaseInput) { //this bit could be to flag non-Irish characters
                var explanationToPush = 
                outputArray.splice(index,0,"?");
                explanationArray.splice(index,0,explanationToPush);
            }*/

            document.getElementById("explanation-box").style.background = "#999";
            document.getElementById("explanation-box").style.color = "white";
            document.getElementById("output").innerHTML = "<div class='pronunciation'>" + outputArray.join("</div> <span class='plus'>+</span> <div class='pronunciation'>");
            document.getElementById("sharelink").innerHTML = "Copy/paste this result to share it: <a href='/?word="+userInput+"'>https://www.gaeilgebot.com/?word="+userInput+"</a>";
            document.getElementById("explanation").innerHTML = explanationArray.join("");
        }
    //console.log(lowercaseInput);

    }


    // NOT WORKING - ADDRESS run the whole thing again if there are any letters left (ie - duplicate letters)
    var checkingArray = lowercaseInput.split("");
    let uniqueArray = new Set();
    checkingArray.forEach(uniqueArray.add, uniqueArray);
    if (uniqueArray.size > 1 ) {
        theWork();
    }

}
window.onload = submitFunc;