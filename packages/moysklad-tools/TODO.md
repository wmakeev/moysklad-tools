TODO
====

## Обязательные поля

При обновлении/сохранении объекта с обязательными полями легко получить ошибку, не указав это поле.
Набор обязательных полей может меняться. По этой причине нельзя жестко прописывать в код список полей которе необходимо указывать для сущности.

Нужно реализовать метод, который на основе метаданных проверяет наличие обязательных полей и устанавливает значения по умолчанию.