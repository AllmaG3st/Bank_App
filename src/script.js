'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-07-11T23:36:17.929Z',
    '2021-12-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-12-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//Calculate Date

const formantMovementDate = (date) => {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 50 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }



}

// Display Transactions

const displayMovements = (acc, sort = false) => {

  containerMovements.innerHTML = '';

  const movs = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formantMovementDate(date);

    //Adding Date

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

// Create UserNames for Users
const createUserName = (accs) => {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map((e) => e[0])
      .join('')
  });
};
createUserName(accounts);

// Calculate account balance

const calcPrintBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, el) => acc + el);
  labelBalance.textContent = `${acc.balance.toFixed(2)}`;
};

// Calculate Summary

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements.filter(el => el > 0).reduce((acc, el) => acc + el);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements.filter(el => el < 0).reduce((acc, el) => acc + el);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`

  const interest = acc.movements.filter(el => el > 0).filter(e => e * acc.interestRate > 1).reduce((sum, el) => sum + el * acc.interestRate / 100, 0)
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

const updateUI = (acc) => {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcPrintBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
}

//! Login

let currentAccount;

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI 
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    labelWelcome.style.color = '#444';
    updateUI(currentAccount);

    //Current Date

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

  } else {
    labelWelcome.textContent = `Password or username are not correct`;
    labelWelcome.style.color = 'red';
  }

  inputLoginUsername.value = inputLoginPin.value = '';

  inputLoginPin.blur();
});

//! Transfer

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(acc => acc.userName === inputTransferTo.value);
  const div = document.querySelector('.operation--transfer');
  const error = `
      <div class='error' style="color:red" >Wrong user or amount</div>
    `

  //Checking Transfer validity
  if (amount > 0 && currentAccount.balance >= amount && receiverAccount && receiverAccount?.userName !== currentAccount.userName) {
    document.querySelector('.error')?.remove();
    //Transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

  } else {
    div.insertAdjacentHTML('afterbegin', error)
  }

  inputTransferAmount.value = inputTransferTo.value = '';

})

//! Delete The account

btnClose.addEventListener('click', (e) => {

  e.preventDefault();

  const div = document.querySelector('.operation--close');
  const error = `
      <div class='error' style="color:yellow" >Password or username are not correct</div>
    `;

  //Check if credentials are correct
  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === +inputClosePin.value) {
    document.querySelector('.error')?.remove();
    const index = accounts.find(acc => acc.userName === currentAccount.userName);
    //HideUI 
    containerApp.style.opacity = 0;
    //Delete The account
    accounts.splice(index, 1);
    //Show message
    labelWelcome.textContent = `Hope to see you again, ${currentAccount.owner.split(' ')[0]}`;
  } else {
    div.insertAdjacentHTML('afterbegin', error)
  }

  inputCloseUsername.value = inputClosePin.value = '';
})


//! Request Loan

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const div = document.querySelector('.operation--loan');
  const error = `
      <div class='error' style="color:red" >Bank can't provide this loan</div>
    `;

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * .1)) {
    //Add loan
    document.querySelector('.error')?.remove();
    currentAccount.movements.push(amount);

    //Add date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    //Create date
  } else {
    //Add error
    div.insertAdjacentHTML('afterbegin', error);
  }

  inputLoanAmount.value = '';
});

//! Sorting

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

