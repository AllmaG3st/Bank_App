'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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



// Display Transactions

const displayMovements = (movements, sort = false) => {

  containerMovements.innerHTML = '';

  const movs = sort ? [...movements].sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
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
  labelBalance.textContent = `${acc.balance}`;
};

// Calculate Summary

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements.filter(el => el > 0).reduce((acc, el) => acc + el);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter(el => el < 0).reduce((acc, el) => acc + el);
  labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = acc.movements.filter(el => el > 0).filter(e => e * acc.interestRate > 1).reduce((sum, el) => sum + el * acc.interestRate / 100, 0)
  labelSumInterest.textContent = `${interest}€`;
}

const updateUI = (acc) => {
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcPrintBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
}

//! Login

let currentAccount;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI 
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    labelWelcome.style.color = '#444';
    updateUI(currentAccount);
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
    //Transfer itself
    console.log('valid');
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
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

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * .1)) {
    //Add loan
    document.querySelector('.error')?.remove();
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
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
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})