Разработать простое приложение для сортировки и отбора данных по заранее заданным
правилам. Приложение должно уметь работать со списками JSON объектов произвольной
структуры, отбирать объекты, содержащие ключи с определенными значениями, а также
сортировать объекты по значениям, используя естественный порядок сортировки.

Например, если для данных вида:
{“data”: [{“name”: “John”, “email”: “john2@mail.com”},
{“name”: “John”, “email”: “john1@mail.com”},
{“name”: “Jane”, “email”: “jane@mail.com”}]}

задать условие:
{“condition”: {“include”: [{“name”: “John”}], “sort_by”: [“email”]}}
содержащее два правила - include и sort_by (где правило include принимает набор пар
ключ:значение для проверки записей на соответствие, а правило sort_by принимает набор
ключей для сортировки), результатом будет объект, содержащий только записи с именем
John , отсортированные по ключу email :
{“result”: [{“name”: “John”, “email”: “john1@mail.com”},
{“name”: “John”, “email”: “john2@mail.com”}]}

Входящие параметры:
JSON объект со списком данных ( data ), и условием для обработки ( condition ):
{“data”: [{“user”: “mike@mail.com”, “rating”: 20, “disabled”: false},
{“user”: “greg@mail.com”, “rating”: 14, “disabled”: false},
{“user”: “john@mail.com”, “rating”: 25, “disabled”: true}],
“condition”: {“exclude”: [{“disabled”: true}], “sort_by”: [“rating”]}}

Выходные данные:
JSON объект с данными полученными после применения условия обработки ( result ):
{“result”: [{“user”: “greg@mail.com”, “rating”: 14, “disabled”: false},
{“user”: “mike@mail.com”, “rating”: 20, “disabled”: false}]}
