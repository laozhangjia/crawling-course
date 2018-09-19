const fs = require('fs');
let list = fs.readFileSync('./assets/lizhi/results/my-distribution.json', {encoding: 'utf-8'});

var jsonData = JSON.parse(list).data;
console.log(jsonData.length);

/*
console.log(jsonData.length);
jsonData.forEach((item) => {
    item.sameId = item.courseLink.split('/').pop().split('?')[0];
    item.teacherid = String(item.teacherid);
    item.teacher_income = Number(item.teacher_income);

});

fs.writeFile('./lizhi.json', JSON.stringify({data: jsonData}), (err) => {
    if (err) throw err;
    console.log('data conversion Successful');
});
*/
