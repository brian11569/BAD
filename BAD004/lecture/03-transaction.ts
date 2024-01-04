import { knex } from './db'
import { HttpError } from './http.error'

/* 

alice: $150

Transaction A:
alice -> bob ($100)

Transaction B:
alice -> charlie ($100)

*/

async function main_v1() {
  let amount = 100
  let from_id = 1
  let to_id = 2

  let txn = await knex.transaction()

  try {
    let from_account = await txn('account')
      .select('amount')
      .where({ id: from_id })
      .first()
    if (!from_account) {
      throw new HttpError(404, 'from account not found')
    }
    if (from_account.amount < amount) {
      throw new HttpError(406, 'not enough balance in account')
    }

    let to_account = await txn('account')
      .select('id')
      .where({ id: to_id })
      .first()
    if (!to_account) {
      throw new HttpError(404, 'to account not found')
    }

    await txn.raw(
      /* sql */ `
    update account
    set amount = amount - ?
    where id = ?
    `,
      [amount, from_id],
    )
    //   await txn.raw(
    //     /* sql */ `
    // update account
    // set amount = ?
    // where id = ?
    // `,
    //     [from_account.amount - amount, from_id],
    //   )

    await txn.raw(
      /* sql */ `
	update account
	set amount = amount + ?
	where id = ?
	`,
      [amount, to_id],
    )

    await txn.commit()
  } catch (error) {
    await txn.rollback()
    throw error
  }
}

async function main_v2() {
  let amount = 100
  let from_id = 1
  let to_id = 2

  let json = await knex.transaction(async knex => {
    let from_account = await knex('account')
      .select('amount')
      .where({ id: from_id })
      .first()
    if (!from_account) {
      throw new HttpError(404, 'from account not found')
    }
    if (from_account.amount < amount) {
      throw new HttpError(406, 'not enough balance in account')
    }

    let to_account = await knex('account')
      .select('id')
      .where({ id: to_id })
      .first()
    if (!to_account) {
      throw new HttpError(404, 'to account not found')
    }

    await knex.raw(
      /* sql */ `
    update account
    set amount = amount - ?
    where id = ?
    `,
      [amount, from_id],
    )

    await knex.raw(
      /* sql */ `
	update account
	set amount = amount + ?
	where id = ?
	`,
      [amount, to_id],
    )

    return { balance: from_account.amount - amount }
  })
}