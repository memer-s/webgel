import './../debug.css'

class Debug {
	private debugElement: HTMLElement;

	constructor(name: string) {
		this.debugElement = document.createElement("div")
		this.debugElement.className = "debug"
		this.debugElement.append((() => { let h2 = document.createElement("h2"); h2.innerText = name; return h2 })())
	}

	render(el: HTMLElement) {
		el.append(this.debugElement);
	}

	private addInput(name: string): HTMLElement {
		let el = document.createElement("div");
		let label = document.createElement("label");
		label.innerText = name;
		el.append(label)
		// console.log(el);
		
		return el
	}

	addCheckbox(name: string, callback: (e: any) => void) {
		let base = this.addInput(name);
		base.className = "check"
		let input = document.createElement("input");
		input.type = "checkbox"
		input.addEventListener("change", callback)
		base.append(input)
		this.debugElement.append(base)
	}

	addDisplay(name: string) {
		let base = this.addInput(name);
		let text = document.createElement("span");
		text.innerText = "";
		base.append(text)

		this.debugElement.append(base)

		return ((newText: string) => {
			text.innerHTML = newText;
		})
	}

	addButton(name: string, callback: (e: any) => void) {
		let base = document.createElement("div");
		let button = document.createElement("button")
		button.innerText = name;
		button.addEventListener("click", callback)
		base.append(button)
		this.debugElement.append(base)
	}

	addRange(name: string, callback: (e: any) => void, from: number, to: number, step: number = 0.1, initialValue: number | undefined = undefined) {
		let base = this.addInput(name);
		let input = document.createElement("input");
		input.type = "range";

		input.value = initialValue ? initialValue.toString() : ((from+to)/2).toString()

		input.min = from.toString();
		input.max = to.toString();
		input.step = step.toString();

		input.addEventListener("input", callback)

		base.append(input);
		this.debugElement.append(base)
	}
}

export default Debug;