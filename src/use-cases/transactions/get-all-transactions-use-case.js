export class GetAllTransactionsUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute() {
    const transactions = await this.transactionRepository.findAll()

    return transactions
  }
}
