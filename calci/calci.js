class Calculator {
    constructor() {
        this.expression = '';
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.lastOperation = null;
        this.lastValue = null;
        
        this.expressionEl = document.getElementById('expression');
        this.resultEl = document.getElementById('result');
        this.buttons = document.querySelectorAll('.btn');
        
        this.init();
    }
    
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleClick(e));
        });
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        this.updateDisplay();
    }
    
    handleClick(e) {
        const btn = e.currentTarget;
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 100);
        
        const value = btn.dataset.value;
        const action = btn.dataset.action;
        
        if (value !== undefined) {
            this.inputNumber(value);
        } else if (action) {
            this.handleAction(action);
        }
    }
    
    handleKeyboard(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
            this.highlightKey(`[data-value="${key}"]`);
        } else if (key === '.') {
            this.inputNumber('.');
            this.highlightKey(`[data-value="."]`);
        } else if (key === '+' || key === '-') {
            this.handleAction(key === '+' ? 'add' : 'subtract');
            this.highlightKey(`[data-action="${key === '+' ? 'add' : 'subtract'}"]`);
        } else if (key === '*') {
            this.handleAction('multiply');
            this.highlightKey(`[data-action="multiply"]`);
        } else if (key === '/') {
            e.preventDefault();
            this.handleAction('divide');
            this.highlightKey(`[data-action="divide"]`);
        } else if (key === 'Enter' || key === '=') {
            this.handleAction('equals');
            this.highlightKey(`[data-action="equals"]`);
        } else if (key === 'Escape') {
            this.handleAction('clear');
            this.highlightKey(`[data-action="clear"]`);
        } else if (key === 'Backspace') {
            this.handleAction('backspace');
            this.highlightKey(`[data-action="backspace"]`);
        } else if (key === '%') {
            this.handleAction('percent');
            this.highlightKey(`[data-action="percent"]`);
        }
    }
    
    highlightKey(selector) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 100);
        }
    }
    
    inputNumber(num) {
        if (this.shouldResetScreen) {
            this.currentValue = num === '.' ? '0.' : num;
            this.shouldResetScreen = false;
        } else {
            if (num === '.' && this.currentValue.includes('.')) return;
            if (this.currentValue === '0' && num !== '.') {
                this.currentValue = num;
            } else {
                this.currentValue += num;
            }
        }
        this.updateDisplay();
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'percent':
                this.percent();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperation(action);
                break;
            case 'equals':
                this.calculate();
                break;
        }
        this.updateDisplay();
    }
    
    clear() {
        this.expression = '';
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.lastOperation = null;
        this.lastValue = null;
        this.clearActiveOperator();
    }
    
    backspace() {
        if (this.currentValue.length === 1 || (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
            this.currentValue = '0';
        } else {
            this.currentValue = this.currentValue.slice(0, -1);
        }
    }
    
    percent() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
    }
    
    setOperation(op) {
        if (this.operation !== null && !this.shouldResetScreen) {
            this.calculate();
        }
        
        this.previousValue = this.currentValue;
        this.operation = op;
        this.shouldResetScreen = true;
        this.updateExpression();
        this.setActiveOperator(op);
    }
    
    calculate() {
        if (this.operation === null || this.shouldResetScreen) return;
        
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;
        
        switch (this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        this.lastOperation = this.operation;
        this.lastValue = this.currentValue;
        
        this.currentValue = this.formatResult(result);
        this.expression = `${this.previousValue} ${this.getOperatorSymbol(this.operation)} ${this.currentValue}`;
        this.operation = null;
        this.shouldResetScreen = true;
        this.clearActiveOperator();
    }
    
    formatResult(num) {
        if (!isFinite(num)) return 'Error';
        
        const str = num.toString();
        if (str.includes('e')) {
            return num.toPrecision(10).replace(/\.?0+$/, '');
        }
        
        if (str.includes('.')) {
            const decimalPlaces = str.split('.')[1].length;
            if (decimalPlaces > 10) {
                return num.toFixed(10).replace(/\.?0+$/, '');
            }
        }
        
        return str.length > 12 ? num.toExponential(6) : str;
    }
    
    getOperatorSymbol(op) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[op] || op;
    }
    
    updateExpression() {
        if (this.operation && this.previousValue !== '') {
            this.expression = `${this.previousValue} ${this.getOperatorSymbol(this.operation)}`;
        }
    }
    
    updateDisplay() {
        this.expressionEl.textContent = this.expression;
        this.resultEl.textContent = this.currentValue || '0';
        
        this.resultEl.classList.add('animate');
        setTimeout(() => this.resultEl.classList.remove('animate'), 100);
    }
    
    setActiveOperator(op) {
        this.clearActiveOperator();
        const btn = document.querySelector(`[data-action="${op}"]`);
        if (btn) btn.classList.add('active');
    }
    
    clearActiveOperator() {
        document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('active'));
    }
    
    showError(message) {
        this.resultEl.textContent = message;
        this.resultEl.style.color = '#f87171';
        setTimeout(() => {
            this.clear();
            this.resultEl.style.color = '#fff';
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});