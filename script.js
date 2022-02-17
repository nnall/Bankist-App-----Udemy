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

const account5 = {
  owner: 'John Williams',
  movements: [2, 3, 4, 5, 6],
  interestRate: 1,
  pin: 3434,
};

const accounts = [account1, account2, account3, account4, account5];

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

/// Chaining .map() method in with other array and string methods

const user = 'Steven Thomas Williams'; //stw

// Creating a 'create username function
/*
const createUserNames = function (user) {
  const username = user
    .toLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');

  return username;
};

console.log(createUserNames('Bob Riley Smith'));
*/
/// Loop over 'accounts' array, adding a 'username' property to each

///Mapping to the Accounts Objects

//UserName Function

const createUserNames = function (user) {
  const username = user
    .toLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');
  return username;
};

//Account Balance Function

const addBalance = function (userMovements) {
  const balance = userMovements.reduce((acc, amt) => acc + amt, 0);
  return balance;
};

accounts.map(
  account => (
    (account.username = createUserNames(account.owner)), //mapping UN property
    (account.accountBalance = addBalance(account.movements)) //mapping bal property
  )
);

console.log(accounts);

///Displaying the Movements and Balances

const displayMovements = function (account) {
  containerMovements.innerHTML = '';
  account.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div> 
        <div class="movements__value">${mov}€</div>
      </div>
    `; /// "movements__date" div value will be a variable from an earlier function that assigns a date to mov element when a deposit/withdrawal is made, and then will compare that assigned date to the 'balance_date' (current day) div, and provide a value of 'today', '1 day ago', '2 days ago' etc
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

const eurToUsd = 1.1;

//// IN, OUT, & INTEREST Displays

const calcDisplaySummary = function (account) {
  /// Displaying 'IN' & 'OUT' & "INTEREST"
  // income
  const incomes = account.movements
    .filter(mov => mov > 0)
    // .map(mov => Math.round(mov * eurToUsd))
    .reduce((acc, mov) => mov + acc);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements.find(mov => mov < 0)
    ? Math.abs(
        account.movements.filter(mov => mov < 0).reduce((acc, mov) => mov + acc)
      )
    : 0;

  labelSumOut.textContent = `${out}€`; ///include condition "if has a value/exists, else display a zero (i.e. no withdrawals)"

  // console.log(movements);

  const displayInterest = account.movements /// restrict to 100th decimal place
    .filter(mov => mov > 0)
    .map(mov => mov * account.interestRate)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => mov + acc);
  labelSumInterest.textContent = `${String(displayInterest).slice(0, 6)}€`;
};

////Balance Display - Top

const displayBalance = function (account) {
  //// - something to remove only the 'balance' div/// //opacity: 0??
  const acctBalance = account.accountBalance;
  labelBalance.textContent = `${acctBalance}€`;
};

///// Welcome Message

const welcomeMessage = function (account) {
  labelWelcome.textContent = `Welcome back, ${account.owner.slice(
    0,
    account.owner.indexOf(' ')
  )}!`;
};

///////////////////////// LOGIN STUFF /////////////////////////////

//Login Alerts & Variables
const userNameAlert = function () {
  alert('Account not found!');
};
const pinAlert = function () {
  alert('INCORRECT PIN!!');
};

let currentAccount;

//// Event Handler - Login Button 'Click' Function
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const displayAll = function (account) {
    welcomeMessage(account);
    displayMovements(account);
    calcDisplaySummary(account);
    displayBalance(account);
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
  };

  // if(inputLoginUsername) <--- if (UN input exists in accounts)
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value //<-- not .textContent bc its <input>
  );

  const verifyPin = function () {
    if (Number(inputLoginPin.value) === currentAccount.pin) {
      displayAll(currentAccount);
    } else {
      pinAlert();
    }
  };

  currentAccount ? verifyPin() : userNameAlert();
});

console.log(currentAccount);

/////////////////////////// TRANSFER MONEY ////////////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  let transferRecipient;
  let transferAmount;
  const clearBlanks = function () {
    inputTransferTo.value = inputTransferAmount.value = '';
  };

  /// Check & Assign 'transferRecipient' Variable
  if (inputTransferTo.value === currentAccount.username) {
    alert('Cannot transfer funds to same account!');
    clearBlanks();
    return;
  } else if (accounts.find(acc => acc.username === inputTransferTo.value)) {
    transferRecipient = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
  } else {
    alert('Account user not found!');
    clearBlanks();
    return;
  }

  // const transferRecipient = accounts.find(
  //   acc => acc.username === inputTransferTo.value
  // )
  //   ? accounts.find(acc => acc.username === inputTransferTo.value)
  //   : alert('Account user not found!'); //needs to stop here

  //Check & Assign 'transferAmount' variable
  if (Number(inputTransferAmount.value) < 0) {
    alert('Cannot transfer negative amounts!');
    clearBlanks();
    return;
  } else {
    transferAmount = Number(inputTransferAmount.value);
  }
  // const transferAmount =
  //   Number(inputTransferAmount.value) < 0
  //     ? alert('Cannot transfer negative amounts!') //needs to stop here
  //     : Number(inputTransferAmount.value);

  const movements = function () {
    currentAccount.movements.push(transferAmount * -1); ///changing movements arrays
    transferRecipient.movements.push(transferAmount);
  };

  const acctBal = function () {
    currentAccount.accountBalance = addBalance(currentAccount.movements);
    transferRecipient.accountBalance = addBalance(transferRecipient.movements);
  };

  const allChanges = function () {
    movements();
    acctBal();
    displayBalance(currentAccount);
    displayMovements(currentAccount);
    calcDisplaySummary(currentAccount);
    clearBlanks();
  };

  //Verify currentAccount has at least 'transferAmount' much money
  currentAccount.accountBalance >= transferAmount
    ? allChanges()
    : alert(
        `You don't have enough money! You may transfer ${currentAccount.accountBalance} or less.`
      );
  console.log(currentAccount);
  console.log(transferRecipient);
});

console.log(currentAccount);

//////////////////////// CLOSE ACCOUNT /////////////////////////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    inputClosePin.value === currentAccount.pin
  ) {
    console.log('this is the account');
  }
});

// console.log(currentAccount.pin);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/// Lecture 142 - Simple Array methods

//.slice()

let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));

//Creating a 'shallow copy' of an array

console.log(arr.slice());

//Can also use  'Spread Operator' to create shallow copy

console.log([...arr]);

// .splice()

// console.log(arr.splice(2)); // 'extracts' everything 2 pos onward from original array
console.log(arr); //only pos 1 and 2 values remain

arr.splice(-1);
console.log(arr);

arr.splice(1, 2);
console.log(arr);

// .reverse() <-- 'mutates' the array

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f']; //<-- flipping this to correct order

console.log(arr2.reverse());

// .concat()

console.log(arr.concat(arr2));
console.log(arr, arr2);

// .join() //<-- output a string of 'joined' elements

console.log(arr.join('-'));

/// Lecture 143 - the .at() Method

arr = [23, 11, 64];

///position targeting - alternative to arr[#]
console.log(arr.at(0));

//taregting LAST Element in array

//normally..
console.log(arr[arr.length - 1]);

//or with .slice()

console.log(arr.slice(-1)[0]);

//But NOW with .at() method
console.log(arr.at(-1));

//// Lecture 144 - Looping Arrays - .forEach()

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//// Using for(of) Looping
for (const i of movements) {
  if (String(i).startsWith('-')) {
    console.log(`You have made a withdrawal of ${Math.abs(i)}.`);
  } else {
    console.log(`You have deposited ${i}.`);
  }
}

console.log('-----FOR EACH-----');
//// Using .forEach() method
movements.forEach(function (i) {
  if (String(i).startsWith('-')) {
    console.log(`You have made a withdrawal of ${Math.abs(i)}.`);
  } else {
    console.log(`You have deposited ${i}.`);
  }
});

//// targeting the INDEX NNUMBER of the array element

//Using for(of)
console.log('-------targeting index Num: using for(of)-----');

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Transaction ${i + 1}: You deposited ${movement}.`);
  } else {
    console.log(`Transaction ${i + 1}: You withdrew ${Math.abs(movement)}.`);
  }
}

// Using .forEach()
console.log('------targeting index Num: using .forEach()-----');
movements.forEach(function (mov, i) {
  if (mov > 0) {
    console.log(`Transaction ${i + 1}: You deposited ${mov}.`);
  } else {
    console.log(`Transaction ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});

//// Lecture 145 - .forEach() with Maps and Sets

//Maps

const currencies = new Map([
  ['USD', 'United States Dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound Sterling'],
]);

currencies.forEach(function (type, i) {
  console.log(`${i} stands for ${type}.`);
});

//Set

const currenciesUnique = new Set(['USD', 'EUR', 'GBP']);

currenciesUnique.forEach(function (value, key, set) {
  console.log(`${key}: ${value}`);
});

//// Lecture 149: Data Transformation Array Methods: .map(), .filter(), .reduce()

//.map() - Similar to .forEach() - uses 'callback' funciton

//Ex: Converting 'Euros' to dollars

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return Math.round(mov * eurToUsd);
// });

/// Callback as an Arrow Function

const movementsUSD = movements.map(mov => Math.round(mov * eurToUsd));

console.log(movementsUSD);

const movementDescriptions = movements.map((mov, i, arr) => {
  return `Movement ${i + 1} is a ${
    mov > 0 ? `deposit` : `withdrawal`
  } for ${Math.abs(mov)}.`;
});

console.log(movementDescriptions);

console.log(movements); //balance = 3840

////// .filter() Method

const deposits = movements.filter(amt => amt > 0);

console.log(deposits);

const withdrawals = movements.filter(amt => amt < 0);
console.log(withdrawals);

////// .reduce() Method Example

const balance = movements.reduce((acc, amt) => acc + amt, 0);

console.log(balance);

//Getting a 'max' value of array with .reduce()

const movements2 = [25, -400, 35, 100, 75, 20];

const maxNum = movements2.reduce((acc, amt) => {
  const currentMax = amt > acc ? amt : acc;
  console.log(acc);
  return currentMax;
});
console.log(maxNum);

///// Lecture 155 - The Magic of Chaining Methods
//filter  movement deposits only, convert from Euro to Dollars, add together

console.log(movements);

console.log(
  movements
    .filter(mov => mov > 0)
    .map(mov => Math.round(mov * eurToUsd))
    .reduce((acc, mov) => mov + acc)
);

const mixed = [3, 4, 5, -2, -5, 7];

const mixed2 = mixed;

const mixedRev = mixed2.reverse();

console.log(mixed);
console.log(mixedRev);

// const allPositive = mixed.map(num => (num > 0 ? num : num * -1));

// console.log(allPositive);

const number = [2, 5, 6, 7, 8];

const avg = number.reduce((acc, num, i, arr) => acc + num / arr.length, 0);

console.log(avg);

console.log(movements);

///// Lecture 157: the .find() Method

const found = movements.find(mov => mov < 0);
console.log(found);

const accountWilliams = accounts.find(acct => acct.owner === 'John Williams');

console.log(accountWilliams);

///Challenge - as a 'for-of' loop

const accountDavis = function (accounts) {
  for (const acct of accounts) {
    if (acct.owner === 'Jessica Davis') {
      return acct;
    } else {
      continue;
    }
  }
};

console.log(accountDavis(accounts));

const elephant = undefined;

elephant ? console.log('it exists') : console.log(' it does not');

const withdrawalsQuestion = account5.movements.find(mov => mov < 0)
  ? 'There are withdrawals'
  : ' There are NOT withdrawls';

console.log(withdrawalsQuestion);

// console.log(account1);
