-- CreateTable
CREATE TABLE `Clientes` (
    `cli_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cli_nome` VARCHAR(255) NOT NULL,
    `cli_sobreNome` VARCHAR(255) NOT NULL,
    `cli_cpf` VARCHAR(20) NOT NULL,
    `cpf_date` DATE NOT NULL,
    `cli_gender` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `Clientes_cli_id_key`(`cli_id`),
    UNIQUE INDEX `Clientes_cli_cpf_key`(`cli_cpf`),
    PRIMARY KEY (`cli_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Endereco` (
    `end_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cli_id` INTEGER NOT NULL,
    `end_estado` VARCHAR(10) NOT NULL,
    `end_cidade` VARCHAR(255) NOT NULL,
    `end_rua` VARCHAR(255) NOT NULL,
    `end_bairro` VARCHAR(255) NOT NULL,
    `end_numero` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `Endereco_end_id_key`(`end_id`),
    UNIQUE INDEX `Endereco_cli_id_key`(`cli_id`),
    PRIMARY KEY (`end_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RG` (
    `rg_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cli_id` INTEGER NOT NULL,
    `rg_value` VARCHAR(30) NOT NULL,
    `rg_date` DATE NOT NULL,

    UNIQUE INDEX `RG_rg_id_key`(`rg_id`),
    UNIQUE INDEX `RG_rg_value_key`(`rg_value`),
    PRIMARY KEY (`rg_id`, `cli_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Telefone` (
    `tel_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cli_id` INTEGER NOT NULL,
    `tel_ddd` VARCHAR(2) NOT NULL,
    `tel_num` VARCHAR(15) NOT NULL,

    UNIQUE INDEX `Telefone_tel_id_key`(`tel_id`),
    PRIMARY KEY (`tel_id`, `cli_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Email` (
    `email_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cli_id` INTEGER NOT NULL,
    `email_value` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Email_email_id_key`(`email_id`),
    UNIQUE INDEX `Email_email_value_key`(`email_value`),
    PRIMARY KEY (`email_id`, `cli_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servico` (
    `serv_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cli_id` INTEGER NOT NULL,
    `serv_name` VARCHAR(255) NOT NULL,
    `serv_value` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `Servico_serv_id_key`(`serv_id`),
    PRIMARY KEY (`serv_id`, `cli_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `prod_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cli_id` INTEGER NOT NULL,
    `prod_name` VARCHAR(255) NOT NULL,
    `prod_value` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `Produto_prod_id_key`(`prod_id`),
    PRIMARY KEY (`prod_id`, `cli_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_cli_id_fkey` FOREIGN KEY (`cli_id`) REFERENCES `Clientes`(`cli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RG` ADD CONSTRAINT `RG_cli_id_fkey` FOREIGN KEY (`cli_id`) REFERENCES `Clientes`(`cli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Telefone` ADD CONSTRAINT `Telefone_cli_id_fkey` FOREIGN KEY (`cli_id`) REFERENCES `Clientes`(`cli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Email` ADD CONSTRAINT `Email_cli_id_fkey` FOREIGN KEY (`cli_id`) REFERENCES `Clientes`(`cli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servico` ADD CONSTRAINT `Servico_cli_id_fkey` FOREIGN KEY (`cli_id`) REFERENCES `Clientes`(`cli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_cli_id_fkey` FOREIGN KEY (`cli_id`) REFERENCES `Clientes`(`cli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
