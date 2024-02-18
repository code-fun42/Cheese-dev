import DLNode from "~core/linked-list/double/node";

/**
 * @description Класс двустороннего списка.
 */
export default class DoubleLinkedList<T> {
	#first: DLNode<T> | null;
	#last: DLNode<T> | null;

	constructor() {
		this.#first = null;
		this.#last = null;
	}

	* [Symbol.iterator]() {
		let
			current = this.#first;

		while (current) {
			yield current;
			current = current.next;
		}
	}

	/**
	 * @description Добавляет элемент в начало списка.
	 * @param item Новый элемент списка
	 */
	public insertFirst(item: T): void {
		const
			newNode: DLNode<T> = new DLNode(item);

		if (this.#first === null) {
			this.#last = newNode;

		} else {
			this.#first.prev = newNode;
		}

		newNode.next = this.#first;
		this.#first = newNode;
	}

	/**
	 * @description Удаляет элемент из начала списка.
	 * @return T | null
	 */
	public removeFirst(): T | null {
		if (this.#first === null) {
			return null;
		}

		const
			val = this.#first;

		if (this.#first.next === null) {
			this.#last = null;

		} else {
			this.#first.next.prev = null;
		}

		this.#first = this.#first.next;
		return val.data;
	}

	/**
	 * @description Добавляет элемент в конец списка.
	 * @param item Новый элемент списка
	 */
	public insertLast(item: T) {
		const
			newNode: DLNode<T> = new DLNode(item);

		if (this.#last === null) {
			this.#first = newNode;

		} else {
			this.#last.next = newNode;
			newNode.prev = this.#last;
		}

		this.#last = newNode;
	}

	/**
	 * @description Удаляет элемент из конца списка.
	 * @return T | null
	 */
	// public removeLast(): T | null {
	// 	if (this.#last === null) {
	// 		return null;
	// 	}
	//
	// 	const
	// 		val = this.#first;
	//
	// 	if (this.#last.prev === null) {
	// 		this.#first = null;
	//
	// 	} else {
	// 		this.#last.prev.next = null;
	// 	}
	//
	// 	this.#last = this.#last.prev;
	// 	return val.data;
	// }

	/**
	 * @description Возвращает true, если список пустой, и false в обратном случае
	 * @return boolean
	 */
	public isEmpty(): boolean {
		return this.#first === null;
	}

	/**
	 * @description Очищает список
	 */
	public clear(): void {
		this.#first = null;
		this.#last = null;
	}
}
