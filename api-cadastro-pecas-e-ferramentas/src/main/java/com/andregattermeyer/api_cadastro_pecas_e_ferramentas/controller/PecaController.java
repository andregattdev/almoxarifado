package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Peca;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service.PecaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pecas")
public class PecaController {

    private final PecaService pecaService;

    public PecaController(PecaService pecaService) {
        this.pecaService = pecaService;
    }

    @GetMapping
    public List<Peca> listarTodas() {
        return pecaService.listarTodas();
    }

    @GetMapping("/{id}")
    public Peca buscarPorId(@PathVariable Long id) {
        return pecaService.buscarPorId(id);
    }

    @GetMapping("/codigo/{codigo}")
    public Peca buscarPorCodigo(@PathVariable String codigo) {
        return pecaService.buscarPorCodigo(codigo);
    }

    @PostMapping
    public Peca salvar(@RequestBody @Valid Peca peca) {
        return pecaService.salvar(peca);
    }

    @PutMapping("/{id}")
    public Peca atualizar(@PathVariable Long id, @Valid @RequestBody Peca peca) {
        return pecaService.atualizar(id, peca);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Long id) {
        pecaService.apagar(id);
        return ResponseEntity.noContent().build();
    }
}
