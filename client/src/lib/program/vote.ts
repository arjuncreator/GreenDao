
import { 
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

export class VoteProgram {
  static PROGRAM_ID = new PublicKey('Vote111111111111111111111111111111111111111');
  
  static createVoteInstruction(
    proposalId: number,
    vote: boolean,
    fromPubkey: PublicKey
  ): TransactionInstruction {
    const data = Buffer.from([
      vote ? 1 : 0,
      ...new Uint8Array(new Uint32Array([proposalId]).buffer)
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: fromPubkey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.PROGRAM_ID,
      data,
    });
  }

  static async sendVote(
    connection: Connection,
    wallet: any,
    proposalId: number,
    vote: boolean
  ): Promise<string> {
    const instruction = this.createVoteInstruction(
      proposalId,
      vote,
      wallet.publicKey
    );

    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet]
    );

    return signature;
  }
}
