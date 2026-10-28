package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Especificacao;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service.EspecificacaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/especificacoes")
public class EspecificacaoController {

    private final EspecificacaoService especificacaoService;

    public EspecificacaoController(EspecificacaoService especificacaoService) {
        this.especificacaoService = especificacaoService;
    }

    @GetMapping
    public List<Especificacao> listarTodas() {
        return especificacaoService.listarTodas();
    }

    @GetMapping("/{id}")
    public Especificacao buscarPorId(@PathVariable Long id) {
        return especificacaoService.buscarPorId(id);
    }

    @GetMapping("/peca/{pecaId}")
    public List<Especificacao> buscarPorPeca(@PathVariable Long pecaId) {
        return especificacaoService.buscarPorPeca(pecaId);
    }

    @PostMapping
    public Especificacao salvar(@Valid @RequestBody Especificacao especificacao) {
        return especificacaoService.salvar(especificacao);
    }

    @PutMapping("/{id}")
    public Especificacao atualizar(@PathVariable Long id, @Valid @RequestBody Especificacao especificacao) {
        return especificacaoService.atualizar(id, especificacao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Long id) {
        especificacaoService.apagar(id);
        return ResponseEntity.noContent().build();
    }
}
