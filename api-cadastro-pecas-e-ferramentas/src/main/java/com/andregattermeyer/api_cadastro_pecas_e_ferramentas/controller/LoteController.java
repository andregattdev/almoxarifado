package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Lote;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service.LoteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/lotes")
public class LoteController {

    private final LoteService loteService;

    public LoteController(LoteService loteService) {
        this.loteService = loteService;
    }

    @GetMapping
    public List<Lote> listarTodos() {
        return loteService.listarTodos();
    }

    @GetMapping("/{id}")
    public Lote buscarPorId(@PathVariable Long id) {
        return loteService.buscarPorId(id);
    }

    @GetMapping("/peca/{pecaId}")
    public List<Lote> buscarPorPeca(@PathVariable Long pecaId) {
        return loteService.buscarPorPeca(pecaId);
    }

    @PostMapping
    public Lote salvar(@Valid @RequestBody Lote lote) {
        return loteService.salvar(lote);
    }

    @PutMapping("/{id}")
    public Lote atualizar(@PathVariable Long id, @Valid @RequestBody Lote lote) {
        return loteService.atualizar(id, lote);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Long id) {
        loteService.apagar(id);
        return ResponseEntity.noContent().build();
    }
}
