package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.BusinessException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.EspecificacaoNotFoundException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.PecaNotFoundException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Especificacao;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Peca;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.EspecificacaoRepository;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.PecaRepository;

@Service
public class EspecificacaoService {

    private final EspecificacaoRepository especificacaoRepository;
    private final PecaRepository pecaRepository;

    public EspecificacaoService(EspecificacaoRepository especificacaoRepository, PecaRepository pecaRepository) {
        this.especificacaoRepository = especificacaoRepository;
        this.pecaRepository = pecaRepository;
    }

    public List<Especificacao> listarTodas() {
        return especificacaoRepository.findAll()
                .stream()
                .filter(especificacao -> Boolean.TRUE.equals(especificacao.getAtivo()))
                .toList();
    }

    public Especificacao buscarPorId(Long id) {
        return especificacaoRepository.findById(id)
                .filter(especificacao -> Boolean.TRUE.equals(especificacao.getAtivo()))
                .orElseThrow(() -> new EspecificacaoNotFoundException("Especificação com ID " + id + " não encontrada"));
    }

    public List<Especificacao> buscarPorPeca(Long pecaId) {
        return especificacaoRepository.findByPecaId(pecaId)
                .stream()
                .filter(especificacao -> Boolean.TRUE.equals(especificacao.getAtivo()))
                .toList();
    }

    @Transactional
    public Especificacao salvar(Especificacao especificacao) {
        if (especificacao.getMaterial() == null || especificacao.getMaterial().isBlank()) {
            throw new BusinessException("Material da especificação é obrigatório");
        }
        especificacao.setId(null);
        especificacao.setPeca(carregarPeca(especificacao.getPeca()));
        if (especificacao.getAtivo() == null) {
            especificacao.setAtivo(true);
        }
        return especificacaoRepository.save(especificacao);
    }

    @Transactional
    public Especificacao atualizar(Long id, Especificacao novaEspecificacao) {
        Especificacao existente = buscarPorId(id);
        existente.setMaterial(novaEspecificacao.getMaterial());
        existente.setDimensoes(novaEspecificacao.getDimensoes());
        existente.setPeso(novaEspecificacao.getPeso());
        existente.setCor(novaEspecificacao.getCor());
        existente.setDescricaoTecnica(novaEspecificacao.getDescricaoTecnica());
        if (novaEspecificacao.getPeca() != null && novaEspecificacao.getPeca().getId() != null) {
            existente.setPeca(carregarPeca(novaEspecificacao.getPeca()));
        }
        if (novaEspecificacao.getAtivo() != null) {
            existente.setAtivo(novaEspecificacao.getAtivo());
        }
        return especificacaoRepository.save(existente);
    }

    @Transactional
    public void apagar(Long id) {
        Especificacao existente = buscarPorId(id);
        existente.setAtivo(false);
        especificacaoRepository.save(existente);
    }

    private Peca carregarPeca(Peca pecaRef) {
        if (pecaRef == null || pecaRef.getId() == null) {
            throw new BusinessException("Peça da especificação é obrigatória. Envie peca.id");
        }
        return pecaRepository.findById(pecaRef.getId())
                .filter(peca -> Boolean.TRUE.equals(peca.getAtivo()))
                .orElseThrow(() -> new PecaNotFoundException("Peça com ID " + pecaRef.getId() + " não encontrada"));
    }
}
