# Получение результатов расчета сайта с https://madrid.wipo.int/feecalcapp/

Сервис получает 4 параметра, разультата рассчета:
- Basic fee
- Fees of contracting parties
- Complementary fee
- Grand Total (CHF)

### Пример запроса
host-name.zone  

body: {  

* "classes":"21", // Number of classes covered by the mark
* "color":"1",    // Is your mark in colour or colours?
* "contries":[    // Массив id стран
*     "feeForm:j_idt771:1:j_idt774"
* ]
}  


### Пример ответа
body: {  

* "basic": "903.00",      // Basic fee
* "parties": 0,           // Fees of contracting parties
* "additional": "100.00", // Complementary fee
* "total": "2,803.00"     // Grand Total (CHF)
}  
