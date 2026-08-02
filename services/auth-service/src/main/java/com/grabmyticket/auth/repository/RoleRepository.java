package com.grabmyticket.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

    default Optional<Role> findByName(RoleName roleName) {
        return findByName(roleName.name());
    }
}
