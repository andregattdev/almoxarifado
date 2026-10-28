package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Funcionario;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository.FuncionarioRepository;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioController(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return funcionarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Funcionario salvar(@RequestBody Funcionario funcionario) {
        funcionario.setId(null);
        return funcionarioRepository.save(funcionario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable Long id, @RequestBody Funcionario dados) {
        return funcionarioRepository.findById(id)
                .map(existente -> {
                    existente.setNomeFuncionario(dados.getNomeFuncionario());
                    existente.setCargo(dados.getCargo());
                    Funcionario atualizado = funcionarioRepository.save(existente);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Long id) {
        if (!funcionarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        funcionarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}