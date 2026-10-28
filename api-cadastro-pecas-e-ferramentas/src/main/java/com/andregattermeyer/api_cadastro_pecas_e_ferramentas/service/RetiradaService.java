package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.BusinessException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Funcionario;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Peca;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Retirada;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.FuncionarioRepository;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.PecaRepository;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.RetiradaRepository;

@Service
public class RetiradaService {

    private final RetiradaRepository retiradaRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final PecaRepository pecaRepository;

    public RetiradaService(RetiradaRepository retiradaRepository, FuncionarioRepository funcionarioRepository,
            PecaRepository pecaRepository) {
        this.retiradaRepository = retiradaRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.pecaRepository = pecaRepository;
    }

    public List<Retirada> listarTodas() {
        return retiradaRepository.findAllByOrderByDataHoraRetiradaDesc();
    }

    @Transactional
    public Retirada registrar(Long funcionarioId, Long pecaId) {
        if (funcionarioId == null || pecaId == null) {
            throw new BusinessException("funcionarioId e pecaId são obrigatórios");
        }

        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new BusinessException("Funcionário com ID " + funcionarioId + " não encontrado"));
        Peca peca = pecaRepository.findById(pecaId)
                .filter(item -> Boolean.TRUE.equals(item.getAtivo()))
                .orElseThrow(() -> new BusinessException("Peça com ID " + pecaId + " não encontrada"));

        Retirada retirada = new Retirada();
        retirada.setFuncionario(funcionario);
        retirada.setPeca(peca);
        retirada.setDataHoraRetirada(LocalDateTime.now());
        return retiradaRepository.save(retirada);
    }

    @Transactional
    public Retirada registrarDevolucao(Long retiradaId) {
        Retirada retirada = retiradaRepository.findById(retiradaId)
                .orElseThrow(() -> new BusinessException("Retirada com ID " + retiradaId + " não encontrada"));

        if (retirada.getDataHoraDevolucao() != null) {
            throw new BusinessException("Esta peça já foi devolvida");
        }

        retirada.setDataHoraDevolucao(LocalDateTime.now());
        return retiradaRepository.save(retirada);
    }
}