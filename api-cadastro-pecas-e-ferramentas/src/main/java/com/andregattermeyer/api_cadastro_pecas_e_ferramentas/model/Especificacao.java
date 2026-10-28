package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotBlank;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Especificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "especificacao_seq")
    @SequenceGenerator(name = "especificacao_seq", sequenceName = "especificacao_seq", allocationSize = 1)
    private Long id;

    @NotBlank
    private String material;

    private String dimensoes;
    private Double peso;
    private String cor;
    private String descricaoTecnica;

    @ManyToOne(optional = false)
    @JoinColumn(name = "peca_id", nullable = false)
    @JsonIgnoreProperties({"especificacoes", "lotes"})
    private Peca peca;

    @Column(nullable = false)
    @JsonSetter(nulls = Nulls.SKIP)
    private Boolean ativo = true;

    public Especificacao() {
    }

    public Especificacao(String material, String dimensoes, Double peso, String cor, String descricaoTecnica,
            Peca peca) {
        this.material = material;
        this.dimensoes = dimensoes;
        this.peso = peso;
        this.cor = cor;
        this.descricaoTecnica = descricaoTecnica;
        this.peca = peca;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getDimensoes() {
        return dimensoes;
    }

    public void setDimensoes(String dimensoes) {
        this.dimensoes = dimensoes;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getDescricaoTecnica() {
        return descricaoTecnica;
    }

    public void setDescricaoTecnica(String descricaoTecnica) {
        this.descricaoTecnica = descricaoTecnica;
    }

    public Peca getPeca() {
        return peca;
    }

    public void setPeca(Peca peca) {
        this.peca = peca;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo != null ? ativo : true;
    }
}
