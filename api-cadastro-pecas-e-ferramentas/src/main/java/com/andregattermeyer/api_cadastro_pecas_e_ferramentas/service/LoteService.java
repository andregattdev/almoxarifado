package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.BusinessException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.LoteNotFoundException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.PecaNotFoundException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Lote;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Peca;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.LoteRepository;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.PecaRepository;

@Service
public class LoteService {

    private final LoteRepository loteRepository;
    private final PecaRepository pecaRepository;

    public LoteService(LoteRepository loteRepository, PecaRepository pecaRepository) {
        this.loteRepository = loteRepository;
        this.pecaRepository = pecaRepository;
    }

    public List<Lote> listarTodos() {
        return loteRepository.findAll()
                .stream()
                .filter(lote -> Boolean.TRUE.equals(lote.getAtivo()))
                .toList();
    }

    public Lote buscarPorId(Long id) {
        return loteRepository.findById(id)
                .filter(lote -> Boolean.TRUE.equals(lote.getAtivo()))
                .orElseThrow(() -> new LoteNotFoundException("Lote com ID " + id + " não encontrado"));
    }

    public List<Lote> buscarPorPeca(Long pecaId) {
        return loteRepository.findByPecaId(pecaId)
                .stream()
                .filter(lote -> Boolean.TRUE.equals(lote.getAtivo()))
                .toList();
    }

    @Transactional
    public Lote salvar(Lote lote) {
        if (lote.getQuantidade() == null) {
            throw new BusinessException("Quantidade do lote é obrigatória");
        }
        lote.setId(null);
        lote.setPeca(carregarPeca(lote.getPeca()));
        if (lote.getPacoteFechado() == null) {
            lote.setPacoteFechado(false);
        }
        if (lote.getAtivo() == null) {
            lote.setAtivo(true);
        }
        return loteRepository.save(lote);
    }

    @Transactional
    public Lote atualizar(Long id, Lote novoLote) {
        Lote existente = buscarPorId(id);
        existente.setQuantidade(novoLote.getQuantidade());
        if (novoLote.getPacoteFechado() != null) {
            existente.setPacoteFechado(novoLote.getPacoteFechado());
        }
        if (novoLote.getPeca() != null && novoLote.getPeca().getId() != null) {
            existente.setPeca(carregarPeca(novoLote.getPeca()));
        }
        if (novoLote.getAtivo() != null) {
            existente.setAtivo(novoLote.getAtivo());
        }
        return loteRepository.save(existente);
    }

    @Transactional
    public void apagar(Long id) {
        Lote existente = buscarPorId(id);
        existente.setAtivo(false);
        loteRepository.save(existente);
    }

    private Peca carregarPeca(Peca pecaRef) {
        if (pecaRef == null || pecaRef.getId() == null) {
            throw new BusinessException("Peça do lote é obrigatória. Envie peca.id");
        }
        return pecaRepository.findById(pecaRef.getId())
                .filter(peca -> Boolean.TRUE.equals(peca.getAtivo()))
                .orElseThrow(() -> new PecaNotFoundException("Peça com ID " + pecaRef.getId() + " não encontrada"));
    }
}
