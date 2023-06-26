export default class InitForm {
  constructor() {
    this.phoneNum = new Array(11).fill(1)
    this.birthDayNum = '0000-00-00'
    this.nameData = [
    ["AO", "Angola"],
    ["AF", "Afghanistan"],
    ["AL", "Albania"],
    ["DZ", "Algeria"],
    ["AD", "Andorra"],
    ["AI", "Anguilla"],
    ["AG", "Barbuda Antigua"],
    ["AR", "Argentina"],
    ["AM", "Armenia"],
    ["AU", "Australia"],
    ["AT", "Austria"],
    ["AZ", "Azerbaijan"],
    ["BS", "Bahamas"],
    ["BH", "Bahrain"],
    ["BD", "Bangladesh"],
    ["BB", "Barbados"],
    ["BY", "Belarus"],
    ["BE", "Belgium"],
    ["BZ", "Belize"],
    ["BJ", "Benin"],
    ["BM", "Bermuda Is."],
    ["BO", "Bolivia"],
    ["BW", "Botswana"],
    ["BR", "Brazil"],
    ["BN", "Brunei"],
    ["BG", "Bulgaria"],
    ["BF", "Burkina-faso"],
    ["MM", "Burma"],
    ["BI", "Burundi"],
    ["CM", "Cameroon"],
    ["CA", "Canada"],
    ["CF", "Central African Republic"],
    ["TD", "Chad"],
    ["CL", "Chile"],
    ["CN", "China"],
    ["CO", "Colombia"],
    ["CG", "Congo"],
    ["CK", "Cook Is."],
    ["CR", "Costa Rica"],
    ["CU", "Cuba"],
    ["CY", "Cyprus"],
    ["CZ", "Czech Republic"],
    ["DK", "Denmark"],
    ["DJ", "Djibouti"],
    ["DO", "Dominica Rep."],
    ["EC", "Ecuador"],
    ["EG", "Egypt"],
    ["SV", "EI Salvador"],
    ["EE", "Estonia"],
    ["ET", "Ethiopia"],
    ["FJ", "Fiji"],
    ["FI", "Finland"],
    ["FR", "France"],
    ["GF", "French Guiana"],
    ["GA", "Gabon"],
    ["GM", "Gambia"],
    ["GE", "Georgia"],
    ["DE", "Germany"],
    ["GH", "Ghana"],
    ["GI", "Gibraltar"],
    ["GR", "Greece"],
    ["GD", "Grenada"],
    ["GU", "Guam"],
    ["GT", "Guatemala"],
    ["GN", "Guinea"],
    ["GY", "Guyana"],
    ["HT", "Haiti"],
    ["HN", "Honduras"],
    ["HK", "Hongkong"],
    ["HU", "Hungary"],
    ["IS", "Iceland"],
    ["IN", "India"],
    ["ID", "Indonesia"],
    ["IR", "Iran"],
    ["IQ", "Iraq"],
    ["IE", "Ireland"],
    ["IL", "Israel"],
    ["IT", "Italy"],
    ["JM", "Jamaica"],
    ["JP", "Japan"],
    ["JO", "Jordan"],
    ["KH", "Kampuchea (Cambodia )"],
    ["KZ", "Kazakstan"],
    ["KE", "Kenya"],
    ["KR", "Korea"],
    ["KW", "Kuwait"],
    ["KG", "Kyrgyzstan"],
    ["LA", "Laos"],
    ["LV", "Latvia"],
    ["LB", "Lebanon"],
    ["LS", "Lesotho"],
    ["LR", "Liberia"],
    ["LY", "Libya"],
    ["LI", "Liechtenstein"],
    ["LT", "Lithuania"],
    ["LU", "Luxembourg"],
    ["MO", "Macao"],
    ["MG", "Madagascar"],
    ["MW", "Malawi"],
    ["MY", "Malaysia"],
    ["MV", "Maldives"],
    ["ML", "Mali"],
    ["MT", "Malta"],
    ["MU", "Mauritius"],
    ["MX", "Mexico"],
    ["MD", "Moldova"],
    ["MC", "Monaco"],
    ["MN", "Mongolia"],
    ["MS", "Montserrat Is."],
    ["MA", "Morocco"],
    ["MZ", "Mozambique"],
    ["NA", "Namibia"],
    ["NR", "Nauru"],
    ["NP", "Nepal"],
    ["NL", "Netherlands"],
    ["NZ", "New Zealand"],
    ["NI", "Nicaragua"],
    ["NE", "Niger"],
    ["NG", "Nigeria"],
    ["KP", "North Korea"],
    ["NO", "Norway"],
    ["OM", "Oman"],
    ["PK", "Pakistan"],
    ["PA", "Panama"],
    ["PG", "Papua New Cuinea"],
    ["PY", "Paraguay"],
    ["PE", "Peru"],
    ["PH", "Philippines"],
    ["PL", "Poland"],
    ["PF", "French Polynesia"],
    ["PT", "Portugal"],
    ["PR", "Puerto Rico"],
    ["QA", "Qatar"],
    ["RO", "Romania"],
    ["RU", "Russia"],
    ["LC", "Saint Lueia"],
    ["VC", "Saint Vincent"],
    ["SM", "San Marino"],
    ["ST", "Sao Tome and Principe"],
    ["SA", "Saudi Arabia"],
    ["SN", "Senegal"],
    ["SC", "Seychelles"],
    ["SL", "Sierra Leone"],
    ["SG", "Singapore"],
    ["SK", "Slovakia"],
    ["SI", "Slovenia"],
    ["SB", "Solomon Is."],
    ["SO", "Somali"],
    ["ZA", "South Africa"],
    ["ES", "Spain"],
    ["LK", "Sri Lanka"],
    ["SD", "Sudan"],
    ["SR", "Suriname"],
    ["SZ", "Swaziland"],
    ["SE", "Sweden"],
    ["CH", "Switzerland"],
    ["SY", "Syria"],
    ["TW", "Taiwan"],
    ["TJ", "Tajikstan"],
    ["TZ", "Tanzania"],
    ["TH", "Thailand"],
    ["TG", "Togo"],
    ["TO", "Tonga"],
    ["TT", "Trinidad and Tobago"],
    ["TN", "Tunisia"],
    ["TR", "Turkey"],
    ["TM", "Turkmenistan"],
    ["UG", "Uganda"],
    ["UA", "Ukraine"],
    ["AE", "United Arab Emirates"],
    ["GB", "United Kiongdom"],
    ["US", "United States of America"],
    ["UY", "Uruguay"],
    ["UZ", "Uzbekistan"],
    ["VE", "Venezuela"],
    ["VN", "Vietnam"],
    ["YE", "Yemen"],
    ["YU", "Yugoslavia"],
    ["ZW", "Zimbabwe"],
    ["ZR", "Zaire"],
    ["ZM", "Zambia"]];
  }
  init() {
    this.initPhone()
    this.initName()
    this.initCardId()
  }
  initPhone() {
    let newPhone = [...this.phoneNum]
    newPhone[0] = 1
    newPhone[1] = (Math.random()>.5)?3:8
    newPhone[2] = (Math.random()>.5)?6:2
    newPhone = newPhone.map((item, index) => {
      if(index > 2) {
        return ~~(Math.random()*10)
      } else {
        return item
      }
    })
    // document.getElementById('stuPhone').value ='x' + newPhone.join('')
  }
  initName() {
    let firstName = this.nameData[this._selectRandom(0,this.nameData.length)][1]
    let lastName = this.nameData[this._selectRandom(0,this.nameData.length)][1].toLowerCase()
    // document.getElementById('stuName').value = `${firstName} ${lastName}`
  }
  initCardId() {
    let cardId = '42010'
    cardId += this._chooseRandom(1,4)
    cardId += '19'
    cardId += this._chooseRandom(70,99)
    let temval = this._chooseRandom(1,13)
    cardId += temval<10?`0${temval}`:`${temval}`
    cardId += this._chooseRandom(10,29)
    cardId += this._chooseRandom(1000,9999)
    // document.getElementById('stuIdcard').value = cardId
  }
  //选取数组随机值
  _selectRandom(arrMin, arrMax) {
   var choices = arrMax - arrMin + 1;
   return Math.floor(Math.random() * choices + arrMin);
  }
  //选取范围随机数
  _chooseRandom(numMin, numMax) {
    return ~~numMin + Math.floor(Math.random() * (~~numMax - ~~numMin))
  }
}
