package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception.PecaNotFoundException;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Especificacao;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Lote;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Peca;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.PecaRepository;

@Service
public class PecaService {

    private final PecaRepository pecaRepository;

    public PecaService(PecaRepository pecaRepository) {
        this.pecaRepository = pecaRepository;
    }

    public List<Peca> listarTodas() {
        return pecaRepository.findAllByAtivoTrue();
    }

    public Peca buscarPorId(Long id) {
        return pecaRepository.findById(id)
                .filter(peca -> Boolean.TRUE.equals(peca.getAtivo()))
                .orElseThrow(() -> new PecaNotFoundException("Peça com ID " + id + " não encontrada"));
    }

    public Peca buscarPorCodigo(String codigo) {
        return pecaRepository.findByCodigoAndAtivoTrue(codigo)
                .orElseThrow(() -> new PecaNotFoundException("Peça com código " + codigo + " não encontrada"));
    }

    @Transactional
    public Peca salvar(Peca peca) {
        peca.setId(null);
        peca.vincularRelacionamentos();
        return pecaRepository.save(peca);
    }

    @Transactional
    public Peca atualizar(Long id, Peca novaPeca) {
        Peca existente = buscarPorId(id);
        existente.setNomePeca(novaPeca.getNomePeca());
        existente.setCodigo(novaPeca.getCodigo());
        existente.setDescricaoPeca(novaPeca.getDescricaoPeca());
        existente.setEstoque(novaPeca.getEstoque());
        if (novaPeca.getAtivo() != null) {
            existente.setAtivo(novaPeca.getAtivo());
        }

        sincronizarEspecificacoes(existente, novaPeca.getEspecificacoes());
        sincronizarLotes(existente, novaPeca.getLotes());

        return pecaRepository.save(existente);
    }

    public void apagar(Long id) {
        Peca existente = buscarPorId(id);
        existente.setAtivo(false);
        pecaRepository.save(existente);
    }

    private void sincronizarEspecificacoes(Peca existente, List<Especificacao> novas) {
        if (novas == null) {
            return;
        }
        existente.getEspecificacoes().clear();
        for (Especificacao especificacao : novas) {
            especificacao.setId(null);
            especificacao.setPeca(existente);
            if (especificacao.getAtivo() == null) {
                especificacao.setAtivo(true);
            }
            existente.getEspecificacoes().add(especificacao);
        }
    }

    private void sincronizarLotes(Peca existente, List<Lote> novos) {
        if (novos == null) {
            return;
        }
        existente.getLotes().clear();
        for (Lote lote : novos) {
            lote.setId(null);
            lote.setPeca(existente);
            if (lote.getAtivo() == null) {
                lote.setAtivo(true);
            }
            if (lote.getPacoteFechado() == null) {
                lote.setPacoteFechado(false);
            }
            existente.getLotes().add(lote);
        }
    }
}
