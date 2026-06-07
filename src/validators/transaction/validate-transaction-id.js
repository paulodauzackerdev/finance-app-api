import validator from 'validator'
import { InvalidTransactionIdError } from '../../errors/transaction.js'

export const validateTransactionId = (transactionId) => {
  if (!validator.isUUID(transactionId)) {
    throw new InvalidTransactionIdError()
  }
  return transactionId
}
