class CoffeeCard {
    public static void main(String[] args) {
        double balance;
        int rewardPoints;
        CoffeeCard(int initalBalance){
            if (initalBalance<0){
                balance=0;
            }
            else{
                balance = initalBalance;
            } 
            }
        int getBalance(){
            return balance;
        }
        int getRewardPoints(){
            return rewardPoints;
        }
        void reloadCard(int addCash){
            if (addCash>0){
            balance = balance+addCash;
            }
        }
        String buyCoffee(double price){
            if (balance>=price){
                balance = balance-price;
                rewardPoints++;
            }
            else{
                return false;
            }
        }
        String redeemFreeCoffee(){
            if (rewardPoints>=5){
                rewardPoints=rewardPoints-5;
                return true;
            }
                return false;
        } 
        String getCardStatus(){
                if(RewardPoints>=5){
                return balance+","+RewardPoints" - Free Coffee Avaiable!";
                }
            return balance+","+RewardPoints;
        }    
        
    
}
