export class GetDeletedTransactionsUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute() {
    const transactions = await this.transactionRepository.findDeleted()

    return transactions
  }
}
