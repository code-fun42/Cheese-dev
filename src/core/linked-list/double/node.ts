/**
 * @description Узел двустороннего списка.
 */
export default class DLNode<T> {
	public prev: DLNode<T> | null;
	public next: DLNode<T> | null;
	public data: T;

	constructor(data: T) {
		this.data = data;
		this.prev = null;
		this.next = null;
	}
};
