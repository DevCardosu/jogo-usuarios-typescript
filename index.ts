// Interfaces (do código original)
interface UserWallet {
    coins?: number;
    credits?: number;
}

interface User {
    name: string;
    createdAt: Date;
    wallet?: UserWallet;  // Ajustado para usar UserWallet
    talk(): void;
}

interface Admin extends User {
    ban(user: User): void;
    kick(user: User): void;
}

// Funções (do código original, com ajustes)
function createUser(name: string): User {
    return {
        name,
        createdAt: new Date(),
        wallet: { coins: 0, credits: 0 },  // Inicializa wallet com valores padrão
        talk() {
            console.log("Eu sou", name);
        }
    };
}

function updateWallet(user: User, wallet: UserWallet) {
    user.wallet = { ...user.wallet, ...wallet };
}

function promoteUser(user: User): Admin {
    return {
        ...user,
        ban(userToBan) {
            console.log(userToBan.name, "foi banido por:", this.name);
        },
        kick(userToKick) {
            console.log(userToKick.name, "foi expulso por", this.name);
        },
    };
}

// Nova interface para o jogo
interface Game {
    players: User[];  // Lista de jogadores ativos
    admins: Admin[];  // Lista de admins
}

// Função para simular uma rodada de jogo (ganhar moedas)
function playRound(user: User): void {
    const wonCoins = Math.floor(Math.random() * 10) + 1;  // Ganha 1-10 moedas aleatoriamente
    updateWallet(user, { coins: (user.wallet?.coins || 0) + wonCoins });
    console.log(`${user.name} ganhou ${wonCoins} moedas! Total de moedas: ${user.wallet?.coins || 0}`);
    // Ajustado para mostrar o total acumulado
}

// Função para iniciar o jogo (loop simples)
function startGame(game: Game): void {
    console.log("Jogo iniciado! Jogadores:", game.players.map(p => p.name));
    // Simula 3 rodadas para cada jogador
    for (let round = 1; round <= 3; round++) {
        console.log(`\n--- Rodada ${round} ---`);
        game.players.forEach(player => playRound(player));
    }
    // Admins moderam: banir jogadores com menos de 5 moedas
    console.log("\n--- Moderação ---");
    game.admins.forEach(admin => {
        game.players.forEach(player => {
            if ((player.wallet?.coins || 0) < 5) {
                admin.ban(player);
            }
        });
    });
}

// Código principal
const game: Game = { players: [], admins: [] };

// Criar jogadores
const player1 = createUser("Cardoso");
const player2 = createUser("Ana");
game.players.push(player1, player2);

// Promover um jogador a admin
const admin1 = promoteUser(player1);
game.admins.push(admin1);

// Jogadores falam
player1.talk();
player2.talk();

// Iniciar o jogo
startGame(game);