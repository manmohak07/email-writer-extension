console.log("Email Writer Extension - Content Script Loaded");

function createAIButton() {
   const button = document.createElement('div');
   button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
   button.style.marginRight = '8px';
   button.innerHTML = 'AI Reply';
   button.setAttribute('role','button');
   button.setAttribute('data-tooltip','Generate AI Reply');
   return button;
}

function createToneDropdown() {
   const container = document.createElement('div');
   container.className = 'tone-dropdown-container';
   container.style.display = 'inline-block';
   container.style.marginRight = '8px';
   container.style.position = 'relative';
   
   const select = document.createElement('select');
   select.className = 'tone-dropdown J-N';
   select.style.padding = '6px 8px';
   select.style.borderRadius = '4px';
   select.style.border = '1px solid #ccc';
   select.style.backgroundColor = '#f8f9fa';
   select.style.color = '#202124';
   select.style.fontSize = '14px';
   select.style.cursor = 'pointer';
   select.style.outline = 'none';
   
   const tones = [
     { value: 'professional', label: 'Professional' },
     { value: 'friendly', label: 'Friendly' },
     { value: 'casual', label: 'Casual' }
   ];
   
   tones.forEach(tone => {
     const option = document.createElement('option');
     option.value = tone.value;
     option.text = tone.label;
     select.appendChild(option);
   });
   
   // Set default to professional
   select.value = 'professional';
   
   // Save selected tone to storage when changed
   select.addEventListener('change', function() {
     if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
       chrome.storage.local.set({ selectedTone: select.value });
     } else {
       console.log('Chrome storage API not available, tone preference will not be saved');
       // Fallback to localStorage if available
       if (window.localStorage) {
         localStorage.setItem('selectedTone', select.value);
       }
     }
   });
   
   // Load previously selected tone if available
   if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
     chrome.storage.local.get(['selectedTone'], function(result) {
       if (result.selectedTone) {
         select.value = result.selectedTone;
       }
     });
   } else {
     // Fallback to localStorage if available
     if (window.localStorage) {
       const savedTone = localStorage.getItem('selectedTone');
       if (savedTone) {
         select.value = savedTone;
       }
     }
   }
   
   container.appendChild(select);
   return container;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}


function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();
    
    const existingDropdown = document.querySelector('.tone-dropdown-container');
    if (existingDropdown) existingDropdown.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button and tone dropdown");
    const button = createAIButton();
    button.classList.add('ai-reply-button');
    
    const toneDropdown = createToneDropdown();

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const selectedTone = document.querySelector('.tone-dropdown').value;
            
            console.log(`Generating reply with tone: ${selectedTone}`);
            
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone
                })
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box was not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled =  false;
        }
    });

    // Add the dropdown first, then the button
    toolbar.insertBefore(toneDropdown, toolbar.firstChild);
    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});


observer.observe(document.body, {
    childList: true,
    subtree: true
});