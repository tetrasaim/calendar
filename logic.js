// הכתובת הישירה ל-logic.js בגיטהאב
const GITHUB_URL = "https://raw.githubusercontent.com/tetrasaim/calendar/refs/heads/main/logic.js";

async function init() {
    try {
        // 1. הורדת הקובץ כטקסט פשוט (עוקף חסימת Script)
        const response = await fetch(GITHUB_URL);
        const scriptText = await response.text();

        // 2. הזרקה לתוך ה-Context של התוסף
        // אנחנו משתמשים ב-eval בתוך ה-Content Script כי כאן זה מותר (בניגוד להזרקה לדף)
        const script = document.createElement('script');
        script.textContent = scriptText;
        
        // יצירת פונקציה שתריץ את הקוד בסביבה מוגנת
        const executeLogic = new Function(scriptText + "\n return { HEBREW_MONTHS_MAP, calculateTetraDisplay };");
        const logic = executeLogic();
        
        window.tetraLogic = logic;
        console.log("Tetraism: Logic loaded successfully from GitHub");
        
        // 3. הרצת ההמרה
        runConversion();
    } catch (err) {
        console.error("Tetraism: Failed to load logic from GitHub", err);
    }
}

function runConversion() {
    if (!window.tetraLogic) return;

    const dateRegex = /(?:יום\s+[א-ת]+,?\s+)?(\d{1,2})\s+ב?([א-ת]{3,8})\s+(\d{4})/g;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;

    while (node = walker.nextNode()) {
        let text = node.nodeValue;
        if (dateRegex.test(text)) {
            node.nodeValue = text.replace(dateRegex, (match, d, mName, y) => {
                const mNum = window.tetraLogic.HEBREW_MONTHS_MAP[mName];
                if (mNum) {
                    // שימוש בפונקציה המקורית מ-logic.js
                    return window.tetraLogic.calculateTetraDisplay(parseInt(d), mNum, parseInt(y), match);
                }
                return match;
            });
        }
    }
}

init();
