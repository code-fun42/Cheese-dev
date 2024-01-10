/**
 * @description Интерфейс конфигурации модуля Net
 */
export interface NetConfig {
	/**
	 * @description URL, по которому будет совершаться проверка соединения.
	 */
	checkUrl?: string;

	/**
	 * @description Интервал между проверка соединения.
	 */
	checkInterval: number;

	/**
	 * @description Число повторов соединения.
	 */
	retryCount?: number;
}
