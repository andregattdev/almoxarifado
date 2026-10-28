package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Lote;

public interface LoteRepository extends JpaRepository<Lote, Long> {
    
    List<Lote> findByPecaId(Long pecaId);

}
